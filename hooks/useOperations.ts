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

  // Load all data from API
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        farmsData,
        fieldsData,
        cropsData,
        plantingsData,
        harvestsData,
        treatmentsData,
        fertilizationsData,
        irrigationsData,
        tasksData,
        ipmData,
        batchOpsData
      ] = await Promise.all([
        operationsApi.getFarms(),
        operationsApi.getFields(),
        operationsApi.getCrops(),
        operationsApi.getPlantings(),
        operationsApi.getHarvests(),
        operationsApi.getTreatments(),
        operationsApi.getFertilizations(),
        operationsApi.getIrrigations(),
        operationsApi.getTasks(),
        operationsApi.getIPMRecords(),
        operationsApi.getBatchOperations(),
      ]);
      setFarms(farmsData);
      setFields(fieldsData);
      setCrops(cropsData);
      setPlantings(plantingsData);
      setHarvests(harvestsData);
      setTreatments(treatmentsData);
      setFertilizations(fertilizationsData);
      setIrrigations(irrigationsData);
      setTasks(tasksData);
      setIpmRecords(ipmData);
      setBatchOperations(batchOpsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  // CRUD operations (all call API, then reload relevant data)
  const addFarm = useCallback(async (farmData: Omit<Farm, 'id'>) => {
    try {
      await operationsApi.createFarm(farmData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add farm');
      return false;
    }
  }, [loadData]);

  const updateFarm = useCallback(async (id: number, farmData: Partial<Farm>) => {
    try {
      await operationsApi.updateFarm(id, farmData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update farm');
      return false;
    }
  }, [loadData]);

  const deleteFarm = useCallback(async (id: number) => {
    try {
      await operationsApi.deleteFarm(id);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete farm');
      return false;
    }
  }, [loadData]);

  const addField = useCallback(async (fieldData: Omit<Field, 'id' | 'farmName'>) => {
    try {
      await operationsApi.createField(fieldData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add field');
      return false;
    }
  }, [loadData]);

  const updateField = useCallback(async (id: number, fieldData: Partial<Field>) => {
    try {
      await operationsApi.updateField(id, fieldData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update field');
      return false;
    }
  }, [loadData]);

  const deleteField = useCallback(async (id: number) => {
    try {
      await operationsApi.deleteField(id);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete field');
      return false;
    }
  }, [loadData]);

  const addCrop = useCallback(async (cropData: Omit<Crop, 'id' | 'fieldName'>) => {
    try {
      await operationsApi.createCrop(cropData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add crop');
      return false;
    }
  }, [loadData]);

  const updateCrop = useCallback(async (id: number, cropData: Partial<Crop>) => {
    try {
      await operationsApi.updateCrop(id, cropData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update crop');
      return false;
    }
  }, [loadData]);

  const deleteCrop = useCallback(async (id: number) => {
    try {
      await operationsApi.deleteCrop(id);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete crop');
      return false;
    }
  }, [loadData]);

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'fieldName'>) => {
    try {
      await operationsApi.createTask(taskData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
      return false;
    }
  }, [loadData]);

  const updateTask = useCallback(async (id: number, taskData: Partial<Task>) => {
    try {
      await operationsApi.updateTask(id, taskData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      return false;
    }
  }, [loadData]);

  const deleteTask = useCallback(async (id: number) => {
    try {
      await operationsApi.deleteTask(id);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      return false;
    }
  }, [loadData]);

  const updateTaskStatus = useCallback(async (id: number, status: 'To Do' | 'In Progress' | 'Done') => {
    return updateTask(id, { status });
  }, [updateTask]);

  const addPlanting = useCallback(async (plantingData: Omit<Planting, 'id' | 'fieldName' | 'cropName'>) => {
    try {
      await operationsApi.createPlanting(plantingData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add planting');
      return false;
    }
  }, [loadData]);

  const updatePlanting = useCallback(async (id: number, plantingData: Partial<Planting>) => {
    try {
      await operationsApi.updatePlanting(id, plantingData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update planting');
      return false;
    }
  }, [loadData]);

  const deletePlanting = useCallback(async (id: number) => {
    try {
      await operationsApi.deletePlanting(id);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete planting');
      return false;
    }
  }, [loadData]);

  const addHarvest = useCallback(async (harvestData: Omit<Harvest, 'id' | 'fieldName' | 'cropName'>) => {
    try {
      await operationsApi.createHarvest(harvestData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add harvest');
      return false;
    }
  }, [loadData]);

  const updateHarvest = useCallback(async (id: number, harvestData: Partial<Harvest>) => {
    try {
      await operationsApi.updateHarvest(id, harvestData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update harvest');
      return false;
    }
  }, [loadData]);

  const deleteHarvest = useCallback(async (id: number) => {
    try {
      await operationsApi.deleteHarvest(id);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete harvest');
      return false;
    }
  }, [loadData]);

  const addTreatment = useCallback(async (treatmentData: Omit<Treatment, 'id' | 'fieldName' | 'cropName' | 'productName'>) => {
    try {
      await operationsApi.createTreatment(treatmentData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add treatment');
      return false;
    }
  }, [loadData]);

  const updateTreatment = useCallback(async (id: number, treatmentData: Partial<Treatment>) => {
    try {
      await operationsApi.updateTreatment(id, treatmentData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update treatment');
      return false;
    }
  }, [loadData]);

  const deleteTreatment = useCallback(async (id: number) => {
    try {
      await operationsApi.deleteTreatment(id);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete treatment');
      return false;
    }
  }, [loadData]);

  const addFertilization = useCallback(async (fertilizationData: Omit<Fertilization, 'id' | 'fieldName' | 'cropName' | 'productName'>) => {
    try {
      await operationsApi.createFertilization(fertilizationData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add fertilization');
      return false;
    }
  }, [loadData]);

  const updateFertilization = useCallback(async (id: number, fertilizationData: Partial<Fertilization>) => {
    try {
      await operationsApi.updateFertilization(id, fertilizationData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update fertilization');
      return false;
    }
  }, [loadData]);

  const deleteFertilization = useCallback(async (id: number) => {
    try {
      await operationsApi.deleteFertilization(id);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete fertilization');
      return false;
    }
  }, [loadData]);

  const addIrrigation = useCallback(async (irrigationData: Omit<Irrigation, 'id' | 'fieldName'>) => {
    try {
      await operationsApi.createIrrigation(irrigationData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add irrigation');
      return false;
    }
  }, [loadData]);

  const updateIrrigation = useCallback(async (id: number, irrigationData: Partial<Irrigation>) => {
    try {
      await operationsApi.updateIrrigation(id, irrigationData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update irrigation');
      return false;
    }
  }, [loadData]);

  const deleteIrrigation = useCallback(async (id: number) => {
    try {
      await operationsApi.deleteIrrigation(id);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete irrigation');
      return false;
    }
  }, [loadData]);

  const addIPMRecord = useCallback(async (recordData: Omit<IPMRecord, 'id' | 'fieldName'>) => {
    try {
      await operationsApi.createIPMRecord(recordData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add IPM record');
      return false;
    }
  }, [loadData]);

  const updateIPMRecord = useCallback(async (id: number, recordData: Partial<IPMRecord>) => {
    try {
      await operationsApi.updateIPMRecord(id, recordData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update IPM record');
      return false;
    }
  }, [loadData]);

  const deleteIPMRecord = useCallback(async (id: number) => {
    try {
      await operationsApi.deleteIPMRecord(id);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete IPM record');
      return false;
    }
  }, [loadData]);

  const addBatchOperation = useCallback(async (operationData: Omit<BatchOperation, 'id'>) => {
    try {
      await operationsApi.createBatchOperation(operationData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add batch operation');
      return false;
    }
  }, [loadData]);

  const updateBatchOperation = useCallback(async (id: number, operationData: Partial<BatchOperation>) => {
    try {
      await operationsApi.updateBatchOperation(id, operationData);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update batch operation');
      return false;
    }
  }, [loadData]);

  const deleteBatchOperation = useCallback(async (id: number) => {
    try {
      await operationsApi.deleteBatchOperation(id);
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete batch operation');
      return false;
    }
  }, [loadData]);

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

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
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
    loadData,
    addFarm,
    updateFarm,
    deleteFarm,
    addField,
    updateField,
    deleteField,
    addCrop,
    updateCrop,
    deleteCrop,
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
    getFieldsByFarm,
    getCropsByField,
    getTasksByField,
    getOverdueTasks,
    getTasksByStatus,
  };
}