import { AutoMapper } from "../../../utils/autoMapper.js";

class SourceClass {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

class DestinationClass {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

const mappingConfig = {
  auto: true,
  properties: {
    name: "fullName",
    age: (source) => source.age * 2,
  },
};

describe("AutoMapper", () => {
  const mapper = AutoMapper.getInstance();

  it("should map a source object to a destination object based on the mapping configuration", () => {
    const sourceObject = new SourceClass("John Doe", 25);

    mapper.setMapping(SourceClass, DestinationClass, mappingConfig);
    const destinationObject = mapper.map(
      SourceClass,
      DestinationClass,
      sourceObject
    );

    expect(destinationObject.name).toEqual(sourceObject.fullName);
    expect(destinationObject.age).toEqual(sourceObject.age * 2);
  });

  it("should map an array of source objects to an array of destination objects based on the mapping configuration", () => {
    const sourceArray = [
      new SourceClass("John Doe", 25),
      new SourceClass("Jane Smith", 30),
    ];

    mapper.setMapping(SourceClass, DestinationClass, mappingConfig);
    const destinationArray = mapper.mapArray(
      SourceClass,
      DestinationClass,
      sourceArray
    );

    expect(destinationArray.length).toEqual(sourceArray.length);
    expect(destinationArray[0].name).toEqual(sourceArray[0].fullName);
    expect(destinationArray[0].age).toEqual(sourceArray[0].age * 2);
    expect(destinationArray[1].name).toEqual(sourceArray[1].fullName);
    expect(destinationArray[1].age).toEqual(sourceArray[1].age * 2);
  });
});
