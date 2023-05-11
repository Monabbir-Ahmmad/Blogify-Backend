/** @module Utility */

/**
 * A class that provides mapping functionality between objects.
 */
export class AutoMapper {
  /**
   * The mapping configurations between source and destination classes.
   * @type {Object}
   */
  mappings = {};

  /**
   * Private constructor to prevent direct instantiation.
   */
  constructor() {}

  /**
   * Returns the singleton instance of the AutoMapper class.
   * @returns {AutoMapper} The singleton instance.
   */
  static getInstance() {
    if (!AutoMapper.instance) {
      AutoMapper.instance = new AutoMapper();
    }
    return AutoMapper.instance;
  }

  /**
   * Sets the mapping configuration between a source class and a destination class.
   * @template S - The type of the source class.
   * @template D - The type of the destination class.
   * @param {S} sourceClass - The source class.
   * @param {D} destinationClass - The destination class.
   * @param {Object} [mappingConfig] - The mapping configuration.
   * @param {boolean} [mappingConfig.auto = true] - Whether to automatically map properties with the same name.
   * @param {Object} [mappingConfig.properties] - The mapping configuration between properties.
   * @param {string | (src: S) => any} mappingConfig.properties.propertyName - The mapping function for the property.
   */
  setMapping(sourceClass, destinationClass, mappingConfig) {
    if (!this.mappings[sourceClass]) {
      this.mappings[sourceClass] = {};
    }
    this.mappings[sourceClass][destinationClass] = mappingConfig;
  }

  /**
   * Maps a source object to a destination object based on the mapping configuration.
   * @template S - The type of the source class.
   * @template D - The type of the destination class.
   * @param {S} sourceClass - The source class.
   * @param {D} destinationClass - The destination class.
   * @param {S} sourceObject - The source object to map.
   * @returns {D} The mapped destination object.
   */
  map(sourceClass, destinationClass, sourceObject) {
    const mappingConfig = this.mappings[sourceClass]?.[destinationClass];
    const destinationObject = new destinationClass();
    const destinationProperties = Object.keys(destinationObject);
    const mappingProperties = mappingConfig?.properties || {};
    const autoMapping = mappingConfig?.auto ?? true;

    for (const destinationProperty of destinationProperties) {
      if (mappingProperties[destinationProperty]) {
        const mapping = mappingProperties[destinationProperty];
        if (typeof mapping === "function") {
          destinationObject[destinationProperty] = mapping(sourceObject);
        } else {
          destinationObject[destinationProperty] = sourceObject[mapping];
        }
      } else if (autoMapping && sourceObject[destinationProperty]) {
        destinationObject[destinationProperty] =
          sourceObject[destinationProperty];
      }
    }

    return destinationObject;
  }

  /**
   * Maps an array of source objects to an array of destination objects based on the mapping configuration.
   * @template S - The type of the source class.
   * @template D - The type of the destination class.
   * @param {S} sourceClass - The source class.
   * @param {D} destinationClass - The destination class.
   * @param {S[]} sourceArray - The source array to map.
   * @returns {D[]} The mapped destination array.
   */
  mapArray(sourceClass, destinationClass, sourceArray) {
    return sourceArray.map((sourceObject) =>
      this.map(sourceClass, destinationClass, sourceObject)
    );
  }
}
