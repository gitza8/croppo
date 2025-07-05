export interface Farm {
  id: number;
  name: string;
  area: number;
  location: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Field {
  id: number;
  name: string;
  farmId: number;
  farmName: string;
  area: number;
  crop?: string;
  variety?: string;
  plantingDate?: string;
  soilType?: string;
  gpsCoordinates?: {
    lat: number;
    lng: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Crop {
  id: number;
  name: string;
  variety: string;
  fieldId: number;
  fieldName: string;
  plantingDate?: string;
  expectedHarvestDate?: string;
  growthStage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Planting {
  id: number;
  date: string;
  fieldId: number;
  fieldName: string;
  cropId: number;
  cropName: string;
  variety: string;
  operator: string;
  density: number;
  spacing: string;
  notes: string;
  seedBatchId?: number;
  quantityUsed?: number;
  gpsLocation?: {
    lat: number;
    lng: number;
  };
  weatherConditions?: string;
  soilConditions?: string;
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Harvest {
  id: number;
  date: string;
  fieldId: number;
  fieldName: string;
  cropId: number;
  cropName: string;
  yield: number;
  yieldPerHectare: number;
  moisture: number;
  grade: string;
  operator: string;
  weather: string;
  qualityNotes: string;
  storageLocation?: string;
  marketPrice?: number;
  totalValue?: number;
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Treatment {
  id: number;
  date: string;
  fieldId: number;
  fieldName: string;
  cropId: number;
  cropName: string;
  productId: number;
  productName: string;
  target: string;
  rate: number;
  unit: string;
  method: string;
  operator: string;
  effectiveness?: number;
  quantityUsed: number;
  cost?: number;
  weatherConditions?: string;
  windSpeed?: number;
  windDirection?: string;
  temperature?: number;
  humidity?: number;
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Fertilization {
  id: number;
  date: string;
  fieldId: number;
  fieldName: string;
  cropId: number;
  cropName: string;
  productId: number;
  productName: string;
  rate: number;
  unit: string;
  npkRatio: string;
  cost: number;
  operator: string;
  quantityUsed: number;
  applicationMethod: string;
  soilTestRecommendation?: string;
  expectedResponse?: string;
  actualResponse?: string;
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Irrigation {
  id: number;
  date: string;
  fieldId: number;
  fieldName: string;
  duration: number;
  waterApplied: number;
  soilMoisture: string;
  cost: number;
  operator: string;
  method: string;
  flowRate?: number;
  pressure?: number;
  energyCost?: number;
  efficiency?: number;
  weatherConditions?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  assignee: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'High' | 'Medium' | 'Low';
  fieldId?: number;
  fieldName?: string;
  gpsLocation?: {
    lat: number;
    lng: number;
  };
  timeSpent?: number;
  laborCost?: number;
  attachments: string[];
  completedDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPMRecord {
  id: number;
  date: string;
  fieldId: number;
  fieldName: string;
  pest: string;
  count: number;
  threshold: number;
  severity: 'Low' | 'Medium' | 'High';
  action: string;
  notes: string;
  treatmentId?: number;
  scoutingMethod?: string;
  weatherConditions?: string;
  cropGrowthStage?: string;
  economicThreshold?: number;
  actionThreshold?: number;
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BatchOperation {
  id: number;
  name: string;
  operationType: 'Fertilization' | 'Treatment' | 'Irrigation' | 'Custom';
  fieldIds: number[];
  fieldNames: string[];
  date: string;
  operator: string;
  productId?: number;
  productName?: string;
  rate?: number;
  unit?: string;
  notes: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  totalCost?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryTransaction {
  id: number;
  itemId: number;
  itemName: string;
  type: 'Stock In' | 'Stock Out' | 'Adjustment';
  quantity: number;
  unit: string;
  reason: string;
  operator: string;
  date: string;
  cost?: number;
  batchNumber?: string;
  expiryDate?: string;
  supplier?: string;
  invoiceNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WeatherData {
  date: string;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  humidity: number;
  precipitation: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  conditions: string;
}

export interface SoilTest {
  id: number;
  fieldId: number;
  fieldName: string;
  date: string;
  ph: number;
  organicMatter: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  recommendations: string;
  labName: string;
  reportUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}