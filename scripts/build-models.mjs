import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { DRACOExporter } from 'three/addons/exporters/DRACOExporter.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const cacheDirectory = `${root}.cache/models`;
const outputDirectory = `${root}public/models`;

const models = [
  {
    name: 'left',
    url: 'https://raw.githubusercontent.com/Badjau/zmk-config-mk1/master/stl/final_left.stl',
    source: `${cacheDirectory}/final_left.stl`,
    output: `${outputDirectory}/tbk-left.drc`,
  },
];

await mkdir(cacheDirectory, { recursive: true });
await mkdir(outputDirectory, { recursive: true });
const encoderPath = fileURLToPath(new URL('../node_modules/three/examples/jsm/libs/draco/draco_encoder.js', import.meta.url));
vm.runInThisContext(readFileSync(encoderPath, 'utf8'), { filename: encoderPath });

for (const model of models) {
  if (!existsSync(model.source)) {
    console.log(`Downloading ${model.name} shell…`);
    const response = await fetch(model.url);
    if (!response.ok) throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    await writeFile(model.source, new Uint8Array(await response.arrayBuffer()));
  }

  console.log(`Parsing ${model.name} shell…`);
  const source = await readFile(model.source);
  const sourceBuffer = source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
  const loaded = new STLLoader().parse(sourceBuffer);
  const geometry = mergeVertices(loaded, 0.0001);
  const triangleCount = (geometry.getIndex()?.count ?? geometry.getAttribute('position').count) / 3;
  geometry.deleteAttribute('normal');
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  const mesh = new THREE.Mesh(geometry);
  const encoded = new DRACOExporter().parse(mesh, {
    encodeSpeed: 3,
    decodeSpeed: 5,
    quantization: [14, 10, 8, 8, 8],
    exportNormals: true,
    exportUvs: false,
  });

  await writeFile(model.output, encoded);
  console.log(`${model.name}: ${triangleCount} triangles, ${(encoded.byteLength / 1024).toFixed(0)} KiB`);
  geometry.dispose();
}
