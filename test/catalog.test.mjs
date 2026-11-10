import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build, load, validate } from '../scripts/catalog.mjs';

const clone = (value) => structuredClone(value);

test('the dataset in this repository is valid', () => {
  assert.deepEqual(validate(load()), []);
});

test('catches the mistakes a schema cannot', () => {
  const data = clone(load());
  const tomato = data.crops[0].crop;
  tomato.family = 'no-such-family';
  tomato.windows.transplant = { frost: 'last', weeksEarliest: 3, weeksLatest: 1 };
  tomato.varieties = [{ id: 'cherry', name: 'Cherry' }];
  data.crops.push({ file: 'wrong-name.yaml', crop: clone(load().crops[0].crop) });
  data.companions = [{ crops: ['tomato', 'nothing'], kind: 'helps', reason: 'x', source: 'hand-curation' }];

  const errors = validate(data).join('\n');
  assert.match(errors, /unknown family "no-such-family"/);
  assert.match(errors, /windows.transplant starts after it ends/);
  assert.match(errors, /variety "cherry" must start with "tomato-"/);
  assert.match(errors, /id "tomato" must match the file name/);
  assert.match(errors, /English name "Tomato" is also used/);
  assert.match(errors, /unknown crop "nothing"/);
});

test('a perennial needs hardiness zones, in order', () => {
  const data = clone(load());
  const tomato = data.crops[0].crop;
  tomato.lifeCycle = 'perennial';
  assert.match(validate(data).join('\n'), /a perennial needs hardinessZones/);
  tomato.hardinessZones = { min: 9, max: 4 };
  assert.match(validate(data).join('\n'), /hardinessZones.min is above max/);
  tomato.hardinessZones = { min: 4, max: 9 };
  assert.deepEqual(validate(data), []);
});

test('rejects values outside the schema', () => {
  const data = clone(load());
  data.crops[0].crop.habit = 'bush';
  data.crops[0].crop.spacingCm.inRow = -5;
  delete data.crops[0].crop.feeding;
  const errors = validate(data).join('\n');
  assert.match(errors, /must have required property 'feeding'/);
  assert.match(errors, /\/habit must be equal to one of the allowed values/);
  assert.match(errors, /\/spacingCm\/inRow must be > 0/);
});

test('builds a release with a fixed version and metric units', () => {
  const release = build(load(), '0.1.0');
  assert.equal(release.version, '0.1.0');
  assert.deepEqual(release.units, { length: 'cm', temperature: 'C' });
  assert.equal(release.crops[0].id, 'tomato');
  assert.throws(() => build(load(), 'v1'), /MAJOR.MINOR.PATCH/);
});
