import { Patient } from '../types';

// Mock patient data for authentication
// Note: In production, this would come from a secure backend
// The 'condition' field is NEVER displayed on the UI
export const mockPatients: Patient[] = [
  {
    patientId: "PT001",
    pin: "1234",
    name: "Rajesh Kumar",
    age: 45,
    condition: "Breast Cancer - Stage 2" // NEVER show on UI
  },
  {
    patientId: "PT002",
    pin: "5678",
    name: "Priya Sharma",
    age: 52,
    condition: "Lung Cancer - Stage 3" // NEVER show on UI
  },
  {
    patientId: "PT003",
    pin: "9012",
    name: "Amit Patel",
    age: 48,
    condition: "Colorectal Cancer - Stage 2" // NEVER show on UI
  }
];
