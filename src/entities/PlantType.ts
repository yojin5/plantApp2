export interface PlantType {
  typeId: string;
  name: string;
  scientificName?: string;
  waterRequirementMl: number;
  frequencyDays: number;
  sunlightRequirement: string;
  soilType: string;
  description?: string;
}

export class PlantTypeEntity implements PlantType {
  typeId: string;
  name: string;
  scientificName?: string;
  waterRequirementMl: number;
  frequencyDays: number;
  sunlightRequirement: string;
  soilType: string;
  description?: string;

  constructor(data: Partial<PlantType>) {
    this.typeId = data.typeId || `type_${Date.now()}`;
    this.name = data.name || '';
    this.scientificName = data.scientificName;
    this.waterRequirementMl = data.waterRequirementMl || 1000;
    this.frequencyDays = data.frequencyDays || 7;
    this.sunlightRequirement = data.sunlightRequirement || 'Full Sun';
    this.soilType = data.soilType || 'Well-draining';
    this.description = data.description;
  }

  toJSON(): PlantType {
    return {
      typeId: this.typeId,
      name: this.name,
      scientificName: this.scientificName,
      waterRequirementMl: this.waterRequirementMl,
      frequencyDays: this.frequencyDays,
      sunlightRequirement: this.sunlightRequirement,
      soilType: this.soilType,
      description: this.description
    };
  }
}