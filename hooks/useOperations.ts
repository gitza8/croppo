import { useState, useEffect, useCallback } from 'react';
import { operationsApi } from '../services/operationsApi';
import { 
  Farm, 
  Field, 
  Crop, 
  Planting, 
  Harvest, 
  Treatment, 
  Fertilization, 
  Irrigation, 
  Task, 
  IPMRecord,
  BatchOperation 
} from '../types/operations';

export function useOperations() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [plantings, setPlantings] = useState<Planting[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [fertilizations, setFertilizations] = useState<Fertilization[]>([]);
  const [irrigations, setIrrigations] = useState<Irrigation[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ipmRecords, setIpmRecords] = useState<IPMRecord[]>([]);
  const [batchOperations, setBatchOperations] = useState<BatchOperation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development
  const mockFarms: Farm[] = [
    { id: 1, name: 'North Farm', area: 150, location: 'North Valley' },
    { id: 2, name: 'South Farm', area: 200, location: 'South Valley' },
  ];

  const mockFields: Field[] = [
    { id: 1, name: 'Field A', farmId: 1, farmName: 'North Farm', area: 50, crop: 'Corn', soilType: 'Clay' },
    { id: 2, name: 'Field B', farmId: 1, farmName: 'North Farm', area: 75, crop: 'Soybeans', soilType: 'Loam' },
    { id: 3, name: 'Field C', farmId: 2, farmName: 'South Farm', area: 100, crop: 'Wheat', soilType: 'Sandy' },
  ];

  const mockCrops: Crop[] = [
    { id: 1, name: 'Corn', variety: 'Pioneer 1234', fieldId: 1, fieldName: 'Field A', plantingDate: '2024-04-15' },
    { id: 2, name: 'Soybeans', variety: 'Asgrow 3456', fieldId: 2, fieldName: 'Field B', plantingDate: '2024-05-01' },
    { id: 3, name: 'Wheat', variety: 'Winter Red', fieldId: 3, fieldName: 'Field C', plantingDate: '2024-09-15' },
  ];

  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Scout Field A for pests',
      description: 'Check for corn borer and aphids',
      dueDate: '2025-01-20',
      assignee: 'John Smith',
      status: 'To Do',
      priority: 'High',
      fieldId: 1,
      fieldName: 'Field A',
      attachments: [],
    },
    {
      id: 2,
      title: 'Apply fertilizer to Field B',
      description: 'Apply nitrogen fertilizer before rain',
      dueDate: '2025-01-18',
      assignee: 'Sarah Johnson',
      status: 'In Progress',
      priority: 'Medium',
      fieldId: 2,
      fieldName: 'Field B',
      attachments: [],
    },
    {
      id: 3,
      title: 'Harvest Field C',
      description: 'Wheat is ready for harvest',
      dueDate: '2025-01-15',
      assignee: 'Mike Davis',
      status: 'Done',
      priority: 'High',
      fieldId: 3,
      fieldName: 'Field C',
      attachments: [],
    },
  ];

  const mockPlantings: Planting[] = [
    {
      id: 1,
      date: '2024-04-15',
      fieldId: 1,
      fieldName: 'Field A',
      cropId: 1,
      cropName: 'Corn',
      variety: 'Pioneer 1234',
      operator: 'John Smith',
      density: 75000,
      spacing: '76cm rows',
      notes: 'Good soil conditions',
      attachments: [],
    },
  ];

  const mockHarvests: Harvest[] = [
    {
      id: 1,
      date: '2024-09-15',
      fieldId: 3,
      fieldName: 'Field C',
      cropId: 3,
      cropName: 'Wheat',
      yield: 45,
      yieldPerHectare: 4.5,
      moisture: 14,
      grade: 'Grade 1',
      operator: 'Mike Davis',
      weather: 'Sunny, 22°C',
      qualityNotes: 'Excellent quality',
      attachments: [],
    },
  ];

  const mockTreatments: Treatment[] = [
    {
      id: 1,
      date: '2024-06-01',
      fieldId: 1,
      fieldName: 'Field A',
      cropId: 1,
      cropName: 'Corn',
      productId: 1,
      productName: 'Roundup',
      target: 'Weeds',
      rate: 2.5,
      unit: 'L/ha',
      method: 'Boom spray',
      operator: 'John Smith',
      quantityUsed: 125,
      attachments: [],
    },
  ];

  const mockFertilizations: Fertilization[] = [
    {
      id: 1,
      date: '2024-05-15',
      fieldId: 2,
      fieldName: 'Field B',
      cropId: 2,
      cropName: 'Soybeans',
      productId: 2,
      productName: 'NPK 20-10-10',
      rate: 150,
      unit: 'kg/ha',
      npkRatio: '20-10-10',
      cost: 450,
      operator: 'Sarah Johnson',
      quantityUsed: 11250,
      applicationMethod: 'Broadcast',
      attachments: [],
    },
  ];

  const mockIrrigations: Irrigation[] = [
    {
      id: 1,
      date: '2024-07-01',
      fieldId: 1,
      fieldName: 'Field A',
      duration: 4,
      waterApplied: 25,
      soilMoisture: 'Adequate',
      cost: 120,
      operator: 'Mike Davis',
      method: 'Pivot',
    },
  ];

  const mockIPMRecords: IPMRecord[] = [
    {
      id: 1,
      date: '2024-06-15',
      fieldId: 1,
      fieldName: 'Field A',
      pest: 'Corn Borer',
      count: 15,
      threshold: 20,
      severity: 'Medium',
      action: 'Monitor',
      notes: 'Below threshold, continue monitoring',
      attachments: [],
    },
  ];

  const mockBatchOperations: BatchOperation[] = [
    {
      id: 1,
      name: 'Spring Fertilization',
      operationType: 'Fertilization',
      fieldIds: [1, 2],
      fieldNames: ['Field A', 'Field B'],
      date: '2024-04-01',
      operator: 'John Smith',
      productName: 'NPK 20-10-10',
      rate: 150,
      unit: 'kg/ha',
      notes: 'Spring fertilization for corn and soybeans',
      status: 'Completed',
    },
  ];

  // Load all data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, use mock data
      // In production, replace with actual API calls
      setFarms(mockFarms);
      setFields(mockFields);
      setCrops(mockCrops);
      setPlantings(mockPlantings);
      setHarvests(mockHarvests);
      setTreatments(mockTreatments);
      setFertilizations(mockFertilizations);
      setIrrigations(mockIrrigations);
      setTasks(mockTasks);
      setIpmRecords(mockIPMRecords);
      setBatchOperations(mockBatchOperations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Farm operations
  const addFarm = useCallback(async (farmData: Omit<Farm, 'id'>) => {
    try {
      const newFarm: Farm = {
        id: Math.max(...farms.map(f => f.id), 0) + 1,
        ...farmData,
      };
      setFarms(prev => [...prev, newFarm]);
      return newFarm;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add farm');
      return null;
    }
  }, [farms]);

  const updateFarm = useCallback(async (id: number, farmData: Partial<Farm>) => {
    try {
      const updatedFarm = { ...farms.find(f => f.id === id)!, ...farmData };
      setFarms(prev => prev.map(farm => farm.id === id ? updatedFarm : farm));
      return updatedFarm;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update farm');
      return null;
    }
  }, [farms]);

  const deleteFarm = useCallback(async (id: number) => {
    try {
      setFarms(prev => prev.filter(farm => farm.id !== id));
      setFields(prev => prev.filter(field => field.farmId !== id));
      setCrops(prev => prev.filter(crop => {
        const field = fields.find(f => f.id === crop.fieldId);
        return field?.farmId !== id;
      }));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete farm');
      return false;
    }
  }, [fields]);

  // Field operations
  const addField = useCallback(async (fieldData: Omit<Field, 'id' | 'farmName'>) => {
    try {
      const farm = farms.find(f => f.id === fieldData.farmId);
      const newField: Field = {
        id: Math.max(...fields.map(f => f.id), 0) + 1,
        farmName: farm?.name || '',
        ...fieldData,
      };
      setFields(prev => [...prev, newField]);
      return newField;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add field');
      return null;
    }
  }, [farms, fields]);

  const updateField = useCallback(async (id: number, fieldData: Partial<Field>) => {
    try {
      const updatedField = { ...fields.find(f => f.id === id)!, ...fieldData };
      setFields(prev => prev.map(field => field.id === id ? updatedField : field));
      return updatedField;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update field');
      return null;
    }
  }, [fields]);

  const deleteField = useCallback(async (id: number) => {
    try {
      setFields(prev => prev.filter(field => field.id !== id));
      setCrops(prev => prev.filter(crop => crop.fieldId !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete field');
      return false;
    }
  }, []);

  // Task operations
  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'fieldName'>) => {
    try {
      const field = fields.find(f => f.id === taskData.fieldId);
      const newTask: Task = {
        id: Math.max(...tasks.map(t => t.id), 0) + 1,
        fieldName: field?.name,
        ...taskData,
      };
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
      return null;
    }
  }, [fields, tasks]);

  const updateTask = useCallback(async (id: number, taskData: Partial<Task>) => {
    try {
      const updatedTask = { ...tasks.find(t => t.id === id)!, ...taskData };
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      return null;
    }
  }, [tasks]);

  const deleteTask = useCallback(async (id: number) => {
    try {
      setTasks(prev => prev.filter(task => task.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      return false;
    }
  }, []);

  const updateTaskStatus = useCallback(async (id: number, status: 'To Do' | 'In Progress' | 'Done') => {
    return updateTask(id, { status });
  }, [updateTask]);

  // Planting operations
  const addPlanting = useCallback(async (plantingData: Omit<Planting, 'id' | 'fieldName' | 'cropName'>) => {
    try {
      const field = fields.find(f => f.id === plantingData.fieldId);
      const crop = crops.find(c => c.id === plantingData.cropId);
      const newPlanting: Planting = {
        id: Math.max(...plantings.map(p => p.id), 0) + 1,
        fieldName: field?.name || '',
        cropName: crop?.name || '',
        ...plantingData,
      };
      setPlantings(prev => [...prev, newPlanting]);
      return newPlanting;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add planting');
      return null;
    }
  }, [fields, crops, plantings]);

  const updatePlanting = useCallback(async (id: number, plantingData: Partial<Planting>) => {
    try {
      const updatedPlanting = { ...plantings.find(p => p.id === id)!, ...plantingData };
      setPlantings(prev => prev.map(planting => planting.id === id ? updatedPlanting : planting));
      return updatedPlanting;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update planting');
      return null;
    }
  }, [plantings]);

  const deletePlanting = useCallback(async (id: number) => {
    try {
      setPlantings(prev => prev.filter(planting => planting.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete planting');
      return false;
    }
  }, []);

  // Harvest operations
  const addHarvest = useCallback(async (harvestData: Omit<Harvest, 'id' | 'fieldName' | 'cropName'>) => {
    try {
      const field = fields.find(f => f.id === harvestData.fieldId);
      const crop = crops.find(c => c.id === harvestData.cropId);
      const newHarvest: Harvest = {
        id: Math.max(...harvests.map(h => h.id), 0) + 1,
        fieldName: field?.name || '',
        cropName: crop?.name || '',
        ...harvestData,
      };
      setHarvests(prev => [...prev, newHarvest]);
      return newHarvest;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add harvest');
      return null;
    }
  }, [fields, crops, harvests]);

  const updateHarvest = useCallback(async (id: number, harvestData: Partial<Harvest>) => {
    try {
      const updatedHarvest = { ...harvests.find(h => h.id === id)!, ...harvestData };
      setHarvests(prev => prev.map(harvest => harvest.id === id ? updatedHarvest : harvest));
      return updatedHarvest;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update harvest');
      return null;
    }
  }, [harvests]);

  const deleteHarvest = useCallback(async (id: number) => {
    try {
      setHarvests(prev => prev.filter(harvest => harvest.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete harvest');
      return false;
    }
  }, []);

  // Treatment operations
  const addTreatment = useCallback(async (treatmentData: Omit<Treatment, 'id' | 'fieldName' | 'cropName' | 'productName'>) => {
    try {
      const field = fields.find(f => f.id === treatmentData.fieldId);
      const crop = crops.find(c => c.id === treatmentData.cropId);
      const newTreatment: Treatment = {
        id: Math.max(...treatments.map(t => t.id), 0) + 1,
        fieldName: field?.name || '',
        cropName: crop?.name || '',
        productName: 'Product Name', // Would come from inventory
        ...treatmentData,
      };
      setTreatments(prev => [...prev, newTreatment]);
      return newTreatment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add treatment');
      return null;
    }
  }, [fields, crops, treatments]);

  const updateTreatment = useCallback(async (id: number, treatmentData: Partial<Treatment>) => {
    try {
      const updatedTreatment = { ...treatments.find(t => t.id === id)!, ...treatmentData };
      setTreatments(prev => prev.map(treatment => treatment.id === id ? updatedTreatment : treatment));
      return updatedTreatment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update treatment');
      return null;
    }
  }, [treatments]);

  const deleteTreatment = useCallback(async (id: number) => {
    try {
      setTreatments(prev => prev.filter(treatment => treatment.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete treatment');
      return false;
    }
  }, []);

  // Fertilization operations
  const addFertilization = useCallback(async (fertilizationData: Omit<Fertilization, 'id' | 'fieldName' | 'cropName' | 'productName'>) => {
    try {
      const field = fields.find(f => f.id === fertilizationData.fieldId);
      const crop = crops.find(c => c.id === fertilizationData.cropId);
      const newFertilization: Fertilization = {
        id: Math.max(...fertilizations.map(f => f.id), 0) + 1,
        fieldName: field?.name || '',
        cropName: crop?.name || '',
        productName: 'Product Name', // Would come from inventory
        ...fertilizationData,
      };
      setFertilizations(prev => [...prev, newFertilization]);
      return newFertilization;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add fertilization');
      return null;
    }
  }, [fields, crops, fertilizations]);

  const updateFertilization = useCallback(async (id: number, fertilizationData: Partial<Fertilization>) => {
    try {
      const updatedFertilization = { ...fertilizations.find(f => f.id === id)!, ...fertilizationData };
      setFertilizations(prev => prev.map(fertilization => fertilization.id === id ? updatedFertilization : fertilization));
      return updatedFertilization;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update fertilization');
      return null;
    }
  }, [fertilizations]);

  const deleteFertilization = useCallback(async (id: number) => {
    try {
      setFertilizations(prev => prev.filter(fertilization => fertilization.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete fertilization');
      return false;
    }
  }, []);

  // Irrigation operations
  const addIrrigation = useCallback(async (irrigationData: Omit<Irrigation, 'id' | 'fieldName'>) => {
    try {
      const field = fields.find(f => f.id === irrigationData.fieldId);
      const newIrrigation: Irrigation = {
        id: Math.max(...irrigations.map(i => i.id), 0) + 1,
        fieldName: field?.name || '',
        ...irrigationData,
      };
      setIrrigations(prev => [...prev, newIrrigation]);
      return newIrrigation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add irrigation');
      return null;
    }
  }, [fields, irrigations]);

  const updateIrrigation = useCallback(async (id: number, irrigationData: Partial<Irrigation>) => {
    try {
      const updatedIrrigation = { ...irrigations.find(i => i.id === id)!, ...irrigationData };
      setIrrigations(prev => prev.map(irrigation => irrigation.id === id ? updatedIrrigation : irrigation));
      return updatedIrrigation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update irrigation');
      return null;
    }
  }, [irrigations]);

  const deleteIrrigation = useCallback(async (id: number) => {
    try {
      setIrrigations(prev => prev.filter(irrigation => irrigation.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete irrigation');
      return false;
    }
  }, []);

  // IPM operations
  const addIPMRecord = useCallback(async (recordData: Omit<IPMRecord, 'id' | 'fieldName'>) => {
    try {
      const field = fields.find(f => f.id === recordData.fieldId);
      const newRecord: IPMRecord = {
        id: Math.max(...ipmRecords.map(r => r.id), 0) + 1,
        fieldName: field?.name || '',
        ...recordData,
      };
      setIpmRecords(prev => [...prev, newRecord]);
      return newRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add IPM record');
      return null;
    }
  }, [fields, ipmRecords]);

  const updateIPMRecord = useCallback(async (id: number, recordData: Partial<IPMRecord>) => {
    try {
      const updatedRecord = { ...ipmRecords.find(r => r.id === id)!, ...recordData };
      setIpmRecords(prev => prev.map(record => record.id === id ? updatedRecord : record));
      return updatedRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update IPM record');
      return null;
    }
  }, [ipmRecords]);

  const deleteIPMRecord = useCallback(async (id: number) => {
    try {
      setIpmRecords(prev => prev.filter(record => record.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete IPM record');
      return false;
    }
  }, []);

  // Batch operations
  const addBatchOperation = useCallback(async (operationData: Omit<BatchOperation, 'id'>) => {
    try {
      const newOperation: BatchOperation = {
        id: Math.max(...batchOperations.map(o => o.id), 0) + 1,
        ...operationData,
      };
      setBatchOperations(prev => [...prev, newOperation]);
      return newOperation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add batch operation');
      return null;
    }
  }, [batchOperations]);

  const updateBatchOperation = useCallback(async (id: number, operationData: Partial<BatchOperation>) => {
    try {
      const updatedOperation = { ...batchOperations.find(o => o.id === id)!, ...operationData };
      setBatchOperations(prev => prev.map(operation => operation.id === id ? updatedOperation : operation));
      return updatedOperation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update batch operation');
      return null;
    }
  }, [batchOperations]);

  const deleteBatchOperation = useCallback(async (id: number) => {
    try {
      setBatchOperations(prev => prev.filter(operation => operation.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete batch operation');
      return false;
    }
  }, []);

  // Utility functions
  const getFieldsByFarm = useCallback((farmId: number) => {
    return fields.filter(field => field.farmId === farmId);
  }, [fields]);

  const getCropsByField = useCallback((fieldId: number) => {
    return crops.filter(crop => crop.fieldId === fieldId);
  }, [crops]);

  const getTasksByField = useCallback((fieldId: number) => {
    return tasks.filter(task => task.fieldId === fieldId);
  }, [tasks]);

  const getOverdueTasks = useCallback(() => {
    const today = new Date();
    return tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < today && task.status !== 'Done';
    });
  }, [tasks]);

  const getTasksByStatus = useCallback((status: 'To Do' | 'In Progress' | 'Done') => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    // Data
    farms,
    fields,
    crops,
    plantings,
    harvests,
    treatments,
    fertilizations,
    irrigations,
    tasks,
    ipmRecords,
    batchOperations,
    loading,
    error,
    
    // Operations
    loadData,
    addFarm,
    updateFarm,
    deleteFarm,
    addField,
    updateField,
    deleteField,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    addPlanting,
    updatePlanting,
    deletePlanting,
    addHarvest,
    updateHarvest,
    deleteHarvest,
    addTreatment,
    updateTreatment,
    deleteTreatment,
    addFertilization,
    updateFertilization,
    deleteFertilization,
    addIrrigation,
    updateIrrigation,
    deleteIrrigation,
    addIPMRecord,
    updateIPMRecord,
    deleteIPMRecord,
    addBatchOperation,
    updateBatchOperation,
    deleteBatchOperation,
    
    // Utility functions
    getFieldsByFarm,
    getCropsByField,
    getTasksByField,
    getOverdueTasks,
    getTasksByStatus,
  };
}