import { buildWhereClauses } from "./read";

describe('build where queries', () => {
  let queryObject;
  it('should correctly build query on a single field', () => {
    queryObject = {
      firstName: 'Karlach',
      lastName: 'Cliffgate'
    };
    const result = buildWhereClauses(queryObject);
    expect(result.length).toEqual(2);
    expect(result[0]).toMatchObject({
      type: "where",
      "_value": queryObject.firstName
    });
    expect(result[1]).toMatchObject({
      type: "where",
      "_value": queryObject.lastName
    });
  });
  it('should correctly build queries on multiple fields', () => {
    queryObject = { class: 'Fighter' };
    const result = buildWhereClauses(queryObject);
    expect(result.length).toEqual(1);
    expect(result[0]).toMatchObject({
      type: "where",
      "_value": queryObject.class
    })
  });
});

describe('read data', () => {
  it('should query database with correct query', () => {
    
  })
})