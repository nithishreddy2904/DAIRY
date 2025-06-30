import React, { createContext, useContext, useState, useMemo } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Shared Farmers Data with join dates for tracking growth
  const [farmers, setFarmers] = useState([
    { id: 'FARM0001', name: 'Rajesh Kumar', phone: '9876543210', email: 'rajesh@email.com', address: 'Village Rampur, District Meerut', cattleCount: '15', bankAccount: '123456789012', ifscCode: 'SBIN0001234', status: 'Active', joinDate: '2025-01-15' },
    { id: 'FARM0002', name: 'Priya Sharma', phone: '8765432109', email: 'priya@email.com', address: 'Village Sundarpur, District Haridwar', cattleCount: '8', bankAccount: '234567890123', ifscCode: 'HDFC0002345', status: 'Active', joinDate: '2025-02-10' },
    { id: 'FARM0003', name: 'Amit Singh', phone: '9123456789', email: 'amit@email.com', address: 'Village Greenfield, District Dehradun', cattleCount: '12', bankAccount: '345678901234', ifscCode: 'ICICI0003456', status: 'Active', joinDate: '2025-03-05' },
    { id: 'FARM0004', name: 'Sunita Patel', phone: '8234567890', email: 'sunita@email.com', address: 'Village Riverside, District Rishikesh', cattleCount: '20', bankAccount: '456789012345', ifscCode: 'AXIS0004567', status: 'Active', joinDate: '2025-04-12' },
    { id: 'FARM0005', name: 'Ravi Kumar', phone: '7345678901', email: 'ravi@email.com', address: 'Village Hillside, District Nainital', cattleCount: '18', bankAccount: '567890123456', ifscCode: 'SBI0005678', status: 'Active', joinDate: '2025-05-20' },
    { id: 'FARM0006', name: 'Meera Devi', phone: '6456789012', email: 'meera@email.com', address: 'Village Lakeside, District Almora', cattleCount: '10', bankAccount: '678901234567', ifscCode: 'HDFC0006789', status: 'Active', joinDate: '2025-06-08' }
  ]);

  // Shared Suppliers Data with join dates for tracking growth
  const [suppliers, setSuppliers] = useState([
    { id: 'SUP001', companyName: 'Green Feed Industries', contactPerson: 'Amit Singh', phone: '9123456789', email: 'amit@greenfeed.com', address: 'Industrial Area, Gurgaon', supplierType: 'Feed Supplier', status: 'Active', joinDate: '2024-12-01' },
    { id: 'SUP002', companyName: 'Dairy Equipment Co.', contactPerson: 'Sunita Patel', phone: '8234567890', email: 'sunita@dairyequip.com', address: 'Tech Park, Pune', supplierType: 'Equipment Supplier', status: 'Active', joinDate: '2025-01-20' },
    { id: 'SUP003', companyName: 'Fresh Packaging Ltd.', contactPerson: 'Rajesh Gupta', phone: '7345678901', email: 'rajesh@freshpack.com', address: 'Industrial Zone, Mumbai', supplierType: 'Packaging Supplier', status: 'Active', joinDate: '2025-02-15' },
    { id: 'SUP004', companyName: 'Bio Nutrients Corp.', contactPerson: 'Priya Mehta', phone: '6456789012', email: 'priya@bionutrients.com', address: 'Science City, Bangalore', supplierType: 'Feed Supplier', status: 'Active', joinDate: '2025-03-10' },
    { id: 'SUP005', companyName: 'Quality Assurance Labs', contactPerson: 'Dr. Anita Sharma', phone: '5567890123', email: 'anita@qalab.com', address: 'Research Park, Hyderabad', supplierType: 'Testing Services', status: 'Active', joinDate: '2025-04-25' },
    { id: 'SUP006', companyName: 'Transport Solutions', contactPerson: 'Vikram Singh', phone: '4678901234', email: 'vikram@transport.com', address: 'Logistics Hub, Delhi', supplierType: 'Logistics', status: 'Active', joinDate: '2025-05-30' }
  ]);

  // Shared Milk Collection Data
  const [milkEntries, setMilkEntries] = useState([
    { farmerId: 'FARM0001', date: '2025-06-25', quantity: '10', shift: 'Morning', quality: 'A+' },
    { farmerId: 'FARM0002', date: '2025-06-25', quantity: '15', shift: 'Evening', quality: 'A' },
    { farmerId: 'FARM0001', date: '2025-06-26', quantity: '12', shift: 'Morning', quality: 'A+' },
    { farmerId: 'FARM0002', date: '2025-06-26', quantity: '14', shift: 'Evening', quality: 'A' },
  ]);

  // Shared Inventory Data
  const [inventoryItems, setInventoryItems] = useState([
    { code: 'RMK0001', name: 'Fresh Toned Milk', category: 'Raw Milk', quantity: '1200', unit: 'Liters', minStock: '500', maxStock: '2000', supplier: 'Dairy Farm Co.', location: 'Cold Storage', status: 'In Stock', lastUpdated: '2025-06-09' },
    { code: 'PKG0001', name: 'PET Bottles 500ml', category: 'Packaging Materials', quantity: '50', unit: 'Boxes', minStock: '100', maxStock: '500', supplier: 'Packaging Solutions Ltd.', location: 'Warehouse A', status: 'Low Stock', lastUpdated: '2025-06-08' }
  ]);

  // Quality Tests Data (shared with Quality Test page)
  const [qualityTests, setQualityTests] = useState([
    { 
      id: 'QT001', 
      batchId: 'BATCH0001', 
      sampleId: 'SAMPLE000001', 
      farmerId: 'FARM0001', 
      farmerName: 'Rajesh Kumar', 
      testDate: '2025-06-15', 
      testType: 'Routine Test', 
      fatContent: '4.2', 
      proteinContent: '3.4', 
      lactoseContent: '4.8', 
      snfContent: '8.5', 
      phLevel: '6.7', 
      bacteriaCount: '15000', 
      adulteration: 'None Detected', 
      overallGrade: 'A+', 
      status: 'Completed', 
      remarks: 'Excellent quality milk', 
      testedBy: 'Dr. Priya Sharma' 
    },
    { 
      id: 'QT002', 
      batchId: 'BATCH0002', 
      sampleId: 'SAMPLE000002', 
      farmerId: 'FARM0002', 
      farmerName: 'Priya Sharma', 
      testDate: '2025-06-16', 
      testType: 'Routine Test', 
      fatContent: '3.8', 
      proteinContent: '3.2', 
      lactoseContent: '4.6', 
      snfContent: '8.2', 
      phLevel: '6.8', 
      bacteriaCount: '18000', 
      adulteration: 'None Detected', 
      overallGrade: 'A', 
      status: 'Completed', 
      remarks: 'Good quality milk', 
      testedBy: 'Dr. Anita Singh' 
    },
    { 
      id: 'QT003', 
      batchId: 'BATCH0003', 
      sampleId: 'SAMPLE000003', 
      farmerId: 'FARM0001', 
      farmerName: 'Rajesh Kumar', 
      testDate: '2025-06-17', 
      testType: 'Special Test', 
      fatContent: '3.5', 
      proteinContent: '3.0', 
      lactoseContent: '4.4', 
      snfContent: '8.0', 
      phLevel: '6.9', 
      bacteriaCount: '22000', 
      adulteration: 'None Detected', 
      overallGrade: 'B', 
      status: 'Completed', 
      remarks: 'Average quality', 
      testedBy: 'Dr. Priya Sharma' 
    }
  ]);

  // Processing Units Data
  const [processingUnits, setProcessingUnits] = useState([
    { id: 'PU0001', name: 'Main Pasteurization Unit', location: 'Block A', manager: 'Rajesh Kumar', phone: '9876543210', capacity: '5000', status: 'Active', type: 'Pasteurization' },
    { id: 'PU0002', name: 'Packaging Unit 1', location: 'Block B', manager: 'Priya Sharma', phone: '9876543211', capacity: '3000', status: 'Active', type: 'Packaging' }
  ]);

  const [productionBatches, setProductionBatches] = useState([
    { batchId: 'B001', unitId: 'PU0001', product: 'Milk', quantity: '2000', date: '2025-06-05', status: 'Completed', quality: 'A+' },
    { batchId: 'B002', unitId: 'PU0002', product: 'Cheese', quantity: '500', date: '2025-06-04', status: 'In Progress', quality: 'A' }
  ]);

  const [qualityChecksData, setQualityChecksData] = useState([
    { batchId: 'B001', unitId: 'PU0001', testDate: '2025-06-05', parameters: { fat: '3.5', protein: '3.2', moisture: '87.5', ph: '6.7' }, result: 'Pass', inspector: 'Dr. Anita' }
  ]);

  const [maintenanceRecordsData, setMaintenanceRecordsData] = useState([
    { unitId: 'PU0001', date: '2025-06-03', type: 'Preventive', description: 'Regular cleaning and calibration', cost: '5000', technician: 'Suresh Tech', status: 'Completed' }
  ]);

  // Shared Logistics Data
  const [vehicles, setVehicles] = useState([
    { number: 'AP09CD1234', type: 'Truck', driver: 'Rajesh Kumar', capacity: '2000', status: 'Available', fuelType: 'Diesel' }
  ]);

  const [deliveries, setDeliveries] = useState([
    { id: 'DEL001', date: '2025-06-10', vehicle: 'AP09CD1234', route: 'North Zone', status: 'Delivered', priority: 'High', estimatedTime: '2 hours', distance: '45 km' }
  ]);

  // Shared Sales Data
  const [retailers, setRetailers] = useState([
    { name: 'FreshMart', location: 'Hyderabad', contact: '9876543210' },
    { name: 'DairyLand', location: 'Secunderabad', contact: '9123456789' }
  ]);

  const [sales, setSales] = useState([
    { date: '2025-06-26', retailer: 'FreshMart', amount: '15000' },
    { date: '2025-06-25', retailer: 'DairyLand', amount: '12000' },
    { date: '2025-06-24', retailer: 'FreshMart', amount: '8500' },
    { date: '2025-05-28', retailer: 'FreshMart', amount: '5000' },
    { date: '2025-05-27', retailer: 'DairyLand', amount: '3200' }
  ]);

  // Shared Workforce Data
  const [employees, setEmployees] = useState([
    { id: 'EMP0001', name: 'Rajesh Kumar', position: 'Manager', department: 'Production', phone: '9876543210', email: 'rajesh@dairy.com', salary: '50000', joinDate: '2024-01-15', status: 'Active' },
    { id: 'EMP0002', name: 'Priya Sharma', position: 'Quality Analyst', department: 'Quality Control', phone: '9876543211', email: 'priya@dairy.com', salary: '35000', joinDate: '2024-02-01', status: 'Active' },
    { id: 'EMP0003', name: 'Amit Singh', position: 'Technician', department: 'Processing', phone: '9876543212', email: 'amit@dairy.com', salary: '28000', joinDate: '2024-03-15', status: 'Active' }
  ]);

  // Shared Reviews Data
  const [reviews, setReviews] = useState([
    { id: 'REV001', customerName: 'Rajesh Kumar', customerEmail: 'rajesh@email.com', category: 'Product Quality', rating: 5, subject: 'Excellent milk quality', comment: 'The milk quality is consistently excellent. Very satisfied with the freshness and taste.', date: '2025-06-08', status: 'Responded' }
  ]);

  // Employee Satisfaction Data
  const [employeeData, setEmployeeData] = useState({
    surveys: [
      { employeeId: 'EMP0001', jobSatisfaction: 9, workLifeBalance: 8, compensationSatisfaction: 9, workEnvironmentRating: 9, surveyDate: '2025-06-01' },
      { employeeId: 'EMP0002', jobSatisfaction: 8, workLifeBalance: 9, compensationSatisfaction: 8, workEnvironmentRating: 8, surveyDate: '2025-06-01' },
      { employeeId: 'EMP0003', jobSatisfaction: 9, workLifeBalance: 7, compensationSatisfaction: 8, workEnvironmentRating: 9, surveyDate: '2025-06-01' }
    ],
    performanceData: [
      { employeeId: 'EMP0001', careerGrowthRating: 8, performanceScore: 95, trainingCompleted: 12, attendanceRate: 98 },
      { employeeId: 'EMP0002', careerGrowthRating: 9, performanceScore: 92, trainingCompleted: 10, attendanceRate: 96 },
      { employeeId: 'EMP0003', careerGrowthRating: 7, performanceScore: 88, trainingCompleted: 8, attendanceRate: 94 }
    ]
  });

  // COMPLIANCE DATA FOR SUSTAINABILITY CALCULATION
  const [complianceRecords, setComplianceRecords] = useState([
    { id: 'COMP001', type: 'FSSAI License', title: 'FSSAI License Renewal', description: 'Annual renewal of FSSAI manufacturing license', status: 'Compliant', priority: 'High', dueDate: '2025-12-31', completedDate: '2025-01-15', assignedTo: 'Quality Manager', documents: ['FSSAI_License.pdf'] },
    { id: 'COMP002', type: 'Environmental Clearance', title: 'ETP Compliance Report', description: 'Monthly effluent treatment plant compliance report', status: 'Compliant', priority: 'Medium', dueDate: '2025-06-30', completedDate: '2025-06-15', assignedTo: 'Environmental Officer', documents: [] },
    { id: 'COMP003', type: 'ISO Certification', title: 'ISO 14001 Environmental Management', description: 'Environmental management system certification', status: 'Compliant', priority: 'High', dueDate: '2025-12-31', completedDate: '2025-03-01', assignedTo: 'Quality Manager', documents: [] },
    { id: 'COMP004', type: 'HACCP', title: 'HACCP Food Safety Standards', description: 'Food safety management system compliance', status: 'Compliant', priority: 'Critical', dueDate: '2025-08-31', completedDate: '2025-04-10', assignedTo: 'Food Safety Officer', documents: [] }
  ]);

  const [certifications, setCertifications] = useState([
    { id: 'CERT001', name: 'ISO 22000:2018', issuingAuthority: 'Bureau Veritas', certificateNumber: 'ISO123456', issueDate: '2024-01-15', expiryDate: '2027-01-14', status: 'Active', renewalRequired: false, documentPath: 'ISO22000.pdf' },
    { id: 'CERT002', name: 'HACCP Certification', issuingAuthority: 'SGS India', certificateNumber: 'HAC789012', issueDate: '2024-03-10', expiryDate: '2025-03-09', status: 'Active', renewalRequired: false, documentPath: 'HACCP.pdf' },
    { id: 'CERT003', name: 'ISO 14001:2015', issuingAuthority: 'TUV India', certificateNumber: 'ENV456789', issueDate: '2024-02-20', expiryDate: '2027-02-19', status: 'Active', renewalRequired: false, documentPath: 'ISO14001.pdf' }
  ]);

  const [audits, setAudits] = useState([
    { id: 'AUD001', auditType: 'Internal Audit', auditor: 'Internal QA Team', scheduledDate: '2025-06-15', completedDate: '2025-06-15', status: 'Completed', findings: 'Minor non-conformities in documentation', correctiveActions: 'Updated SOPs and training conducted', score: 85 },
    { id: 'AUD002', auditType: 'External Audit', auditor: 'Bureau Veritas', scheduledDate: '2025-07-20', completedDate: '2025-07-20', status: 'Completed', findings: 'Excellent compliance standards', correctiveActions: 'None required', score: 95 },
    { id: 'AUD003', auditType: 'Environmental Audit', auditor: 'TUV India', scheduledDate: '2025-05-10', completedDate: '2025-05-10', status: 'Completed', findings: 'Good environmental practices', correctiveActions: 'Minor improvements in waste management', score: 88 }
  ]);

  // Processing Efficiency Data - KEPT ORIGINAL STRUCTURE
  const [processingData, setProcessingData] = useState({
    equipmentUptime: { 
      scheduledHours: 720, 
      maintenanceHours: 8, 
      breakdownHours: 4,
      productiveHours: 708 
    },
    throughputEfficiency: { 
      actualOutput: 9800, 
      plannedOutput: 10000,
      unit: 'liters' 
    },
    qualityRate: { 
      passedQualityTests: 485, 
      totalProductionBatches: 500,
      rejectedBatches: 15 
    },
    wasteMinimization: { 
      wasteGenerated: 50, 
      totalInput: 10000, 
      unit: 'kg' 
    },
    energyEfficiency: { 
      energyConsumed: 2400, 
      unitsProduced: 10000, 
      targetEnergyPerUnit: 0.25,
      unit: 'kWh' 
    }
  });

  // Calculation Functions
  const calculateEmployeeSatisfaction = useMemo(() => {
    const factors = {
      jobSatisfactionScore: 0.3,
      workLifeBalance: 0.25,
      compensationSatisfaction: 0.2,
      careerGrowth: 0.15,
      workEnvironment: 0.1
    };

    if (employees.length === 0 || employeeData.surveys.length === 0) return 92;

    const totalScore = employees.reduce((sum, employee) => {
      const survey = employeeData.surveys.find(s => s.employeeId === employee.id);
      const performance = employeeData.performanceData.find(p => p.employeeId === employee.id);
      
      if (!survey || !performance) return sum + 85;

      const employeeScore = (
        (survey.jobSatisfaction * factors.jobSatisfactionScore * 10) +
        (survey.workLifeBalance * factors.workLifeBalance * 10) +
        (survey.compensationSatisfaction * factors.compensationSatisfaction * 10) +
        (performance.careerGrowthRating * factors.careerGrowth * 10) +
        (survey.workEnvironmentRating * factors.workEnvironment * 10)
      );
      
      return sum + employeeScore;
    }, 0);

    return Math.round(totalScore / employees.length);
  }, [employees, employeeData]);

  // Calculate Sustainability Index from Compliance Page Parameters
  const calculateSustainabilityIndex = useMemo(() => {
    const metrics = {
      // Compliance Rate (40% weight) - Based on compliance records
      complianceRate: {
        weight: 0.40,
        calculate: () => {
          if (complianceRecords.length === 0) return 75;
          const compliantRecords = complianceRecords.filter(record => record.status === 'Compliant').length;
          return (compliantRecords / complianceRecords.length) * 100;
        }
      },
      
      // Certification Status (25% weight) - Based on active certifications
      certificationStatus: {
        weight: 0.25,
        calculate: () => {
          if (certifications.length === 0) return 70;
          const activeCertifications = certifications.filter(cert => cert.status === 'Active').length;
          return (activeCertifications / certifications.length) * 100;
        }
      },
      
      // Audit Performance (20% weight) - Based on audit scores
      auditPerformance: {
        weight: 0.20,
        calculate: () => {
          const completedAudits = audits.filter(audit => audit.status === 'Completed' && audit.score > 0);
          if (completedAudits.length === 0) return 80;
          const averageScore = completedAudits.reduce((sum, audit) => sum + audit.score, 0) / completedAudits.length;
          return averageScore;
        }
      },
      
      // Environmental Compliance (10% weight) - Based on environmental compliance types
      environmentalCompliance: {
        weight: 0.10,
        calculate: () => {
          const environmentalTypes = ['Environmental Clearance', 'ISO Certification'];
          const environmentalRecords = complianceRecords.filter(record => 
            environmentalTypes.some(type => record.type.includes(type) || record.type.includes('Environmental'))
          );
          if (environmentalRecords.length === 0) return 85;
          const compliantEnvironmental = environmentalRecords.filter(record => record.status === 'Compliant').length;
          return (compliantEnvironmental / environmentalRecords.length) * 100;
        }
      },
      
      // Document Management (5% weight) - Based on document completion
      documentManagement: {
        weight: 0.05,
        calculate: () => {
          const recordsWithDocuments = complianceRecords.filter(record => record.documents && record.documents.length > 0).length;
          if (complianceRecords.length === 0) return 90;
          return (recordsWithDocuments / complianceRecords.length) * 100;
        }
      }
    };

    let totalScore = 0;
    Object.entries(metrics).forEach(([key, metric]) => {
      const score = metric.calculate();
      totalScore += score * metric.weight;
    });

    return Math.round(totalScore);
  }, [complianceRecords, certifications, audits]);

  // Calculate Processing Efficiency from Processing Units Page Data
  const calculateProcessingEfficiency = useMemo(() => {
    // Equipment Uptime Calculation (30% weight)
    const calculateEquipmentUptime = () => {
      const activeUnits = processingUnits.filter(unit => unit.status === 'Active').length;
      const totalUnits = processingUnits.length;
      if (totalUnits === 0) return 95;
      
      // Calculate maintenance downtime
      const recentMaintenance = maintenanceRecordsData.filter(record => {
        const recordDate = new Date(record.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return recordDate >= thirtyDaysAgo;
      });
      
      const maintenanceHours = recentMaintenance.length * 4; // Assume 4 hours per maintenance
      const totalScheduledHours = 720; // 30 days * 24 hours
      const uptime = ((totalScheduledHours - maintenanceHours) / totalScheduledHours) * 100;
      
      return Math.min(100, uptime);
    };

    // Throughput Efficiency Calculation (25% weight)
    const calculateThroughputEfficiency = () => {
      const completedBatches = productionBatches.filter(batch => batch.status === 'Completed');
      const totalBatches = productionBatches.length;
      if (totalBatches === 0) return 90;
      
      const actualOutput = completedBatches.reduce((sum, batch) => sum + parseFloat(batch.quantity || 0), 0);
      const plannedOutput = totalBatches * 1500; // Assume average planned output per batch
      
      return Math.min(100, (actualOutput / plannedOutput) * 100);
    };

    // Quality Rate Calculation (20% weight)
    const calculateQualityRate = () => {
      const totalQualityChecks = qualityChecksData.length;
      if (totalQualityChecks === 0) return 85;
      
      const passedChecks = qualityChecksData.filter(check => check.result === 'Pass').length;
      return (passedChecks / totalQualityChecks) * 100;
    };

    // Waste Minimization Calculation (15% weight)
    const calculateWasteMinimization = () => {
      const totalProduction = productionBatches.reduce((sum, batch) => sum + parseFloat(batch.quantity || 0), 0);
      if (totalProduction === 0) return 88;
      
      // Simulate waste based on quality grades
      const highQualityBatches = productionBatches.filter(batch => batch.quality === 'A+' || batch.quality === 'A').length;
      const wastePercentage = Math.max(0, (productionBatches.length - highQualityBatches) / productionBatches.length * 0.05);
      
      return Math.max(0, (1 - wastePercentage) * 100);
    };

    // Energy Efficiency Calculation (10% weight)
    const calculateEnergyEfficiency = () => {
      const activeUnits = processingUnits.filter(unit => unit.status === 'Active').length;
      if (activeUnits === 0) return 82;
      
      // Simulate energy efficiency based on unit types and maintenance
      const wellMaintainedUnits = processingUnits.filter(unit => {
        const recentMaintenance = maintenanceRecordsData.find(record => 
          record.unitId === unit.id && record.status === 'Completed'
        );
        return recentMaintenance !== undefined;
      }).length;
      
      return Math.min(100, (wellMaintainedUnits / activeUnits) * 90 + 10);
    };

    // Calculate weighted score
    const metrics = {
      equipmentUptime: { weight: 0.30, score: calculateEquipmentUptime() },
      throughputEfficiency: { weight: 0.25, score: calculateThroughputEfficiency() },
      qualityRate: { weight: 0.20, score: calculateQualityRate() },
      wasteMinimization: { weight: 0.15, score: calculateWasteMinimization() },
      energyEfficiency: { weight: 0.10, score: calculateEnergyEfficiency() }
    };

    let totalScore = 0;
    Object.values(metrics).forEach(metric => {
      totalScore += metric.score * metric.weight;
    });

    return totalScore.toFixed(1);
  }, [processingUnits, productionBatches, qualityChecksData, maintenanceRecordsData]);

  // Generate Quality Distribution from Quality Tests
  const generateQualityDistribution = useMemo(() => {
    const qualityCount = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0 };
    
    qualityTests.forEach(test => {
      if (test.overallGrade) {
        qualityCount[test.overallGrade] = (qualityCount[test.overallGrade] || 0) + 1;
      }
    });
    
    const total = Object.values(qualityCount).reduce((sum, count) => sum + count, 0);
    
    if (total === 0) {
      return [
        { name: 'No Data', value: 100, color: '#9e9e9e' }
      ];
    }
    
    return [
      { name: 'Excellent (A+)', value: Math.round((qualityCount['A+'] / total) * 100), color: '#4caf50' },
      { name: 'Good (A)', value: Math.round((qualityCount['A'] / total) * 100), color: '#2196f3' },
      { name: 'Average (B)', value: Math.round((qualityCount['B'] / total) * 100), color: '#ff9800' },
      { name: 'Poor (C)', value: Math.round((qualityCount['C'] / total) * 100), color: '#f44336' },
    ].filter(item => item.value > 0);
  }, [qualityTests]);

  // MODIFIED: Generate Network Growth Data from actual Farmers and Suppliers
  const generateNetworkGrowthData = useMemo(() => {
    const monthlyData = [];
    const currentDate = new Date();
    
    // Generate data for last 6 months
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentDate);
      targetDate.setMonth(targetDate.getMonth() - i);
      const monthName = targetDate.toLocaleDateString('en-US', { month: 'short' });
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
      
      // Count farmers who joined by this month
      const farmersByMonth = farmers.filter(farmer => {
        if (!farmer.joinDate) return false;
        const joinDate = new Date(farmer.joinDate);
        return joinDate.getFullYear() < targetYear || 
               (joinDate.getFullYear() === targetYear && joinDate.getMonth() + 1 <= targetMonth);
      }).length;
      
      // Count suppliers who joined by this month
      const suppliersByMonth = suppliers.filter(supplier => {
        if (!supplier.joinDate) return false;
        const joinDate = new Date(supplier.joinDate);
        return joinDate.getFullYear() < targetYear || 
               (joinDate.getFullYear() === targetYear && joinDate.getMonth() + 1 <= targetMonth);
      }).length;
      
      // Count new farmers in this specific month
      const newFarmersThisMonth = farmers.filter(farmer => {
        if (!farmer.joinDate) return false;
        const joinDate = new Date(farmer.joinDate);
        return joinDate.getFullYear() === targetYear && joinDate.getMonth() + 1 === targetMonth;
      }).length;
      
      // Count new suppliers in this specific month
      const newSuppliersThisMonth = suppliers.filter(supplier => {
        if (!supplier.joinDate) return false;
        const joinDate = new Date(supplier.joinDate);
        return joinDate.getFullYear() === targetYear && joinDate.getMonth() + 1 === targetMonth;
      }).length;
      
      monthlyData.push({
        month: monthName,
        farmers: farmersByMonth,
        suppliers: suppliersByMonth,
        newFarmers: newFarmersThisMonth,
        newSuppliers: newSuppliersThisMonth,
        totalNetwork: farmersByMonth + suppliersByMonth
      });
    }
    
    return monthlyData;
  }, [farmers, suppliers]);

  // Helper Functions
  const addFarmer = (newFarmer) => {
    setFarmers(prev => [newFarmer, ...prev]);
  };

  const updateFarmer = (index, updatedFarmer) => {
    setFarmers(prev => {
      const updated = [...prev];
      updated[index] = updatedFarmer;
      return updated;
    });
  };

  const deleteFarmer = (index) => {
    setFarmers(prev => prev.filter((_, i) => i !== index));
  };

  const addSupplier = (newSupplier) => {
    setSuppliers(prev => [newSupplier, ...prev]);
  };

  const deleteSupplier = (index) => {
    setSuppliers(prev => prev.filter((_, i) => i !== index));
  };

  const addMilkEntry = (newEntry) => {
    setMilkEntries(prev => [newEntry, ...prev]);
    updateInventoryOnMilkCollection(newEntry.quantity);
  };

  const updateMilkEntry = (index, updatedEntry) => {
    setMilkEntries(prev => {
      const updated = [...prev];
      updated[index] = updatedEntry;
      return updated;
    });
  };

  const deleteMilkEntry = (index) => {
    setMilkEntries(prev => prev.filter((_, i) => i !== index));
  };

  const updateInventoryOnMilkCollection = (quantity) => {
    setInventoryItems(prev => prev.map(item => 
      item.name === 'Fresh Toned Milk' 
        ? { ...item, quantity: (parseFloat(item.quantity) + parseFloat(quantity)).toString(), lastUpdated: new Date().toISOString().split('T')[0] }
        : item
    ));
  };

  const addInventoryItem = (newItem) => {
    setInventoryItems(prev => [newItem, ...prev]);
  };

  const updateInventoryItem = (index, updatedItem) => {
    setInventoryItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updatedItem, lastUpdated: new Date().toISOString().split('T')[0] };
      return updated;
    });
  };

  const deleteInventoryItem = (index) => {
    setInventoryItems(prev => prev.filter((_, i) => i !== index));
  };

  const addRetailer = (newRetailer) => {
    setRetailers(prev => [newRetailer, ...prev]);
  };

  const updateRetailer = (index, updatedRetailer) => {
    setRetailers(prev => {
      const updated = [...prev];
      updated[index] = updatedRetailer;
      return updated;
    });
  };

  const deleteRetailer = (index) => {
    setRetailers(prev => prev.filter((_, i) => i !== index));
  };

  const addSale = (newSale) => {
    setSales(prev => [newSale, ...prev]);
  };

  const updateSale = (index, updatedSale) => {
    setSales(prev => {
      const updated = [...prev];
      updated[index] = updatedSale;
      return updated;
    });
  };

  const deleteSale = (index) => {
    setSales(prev => prev.filter((_, i) => i !== index));
  };

  const updateEmployeeData = (newData) => {
    setEmployeeData(prev => ({ ...prev, ...newData }));
  };

  const updateProcessingData = (newData) => {
    setProcessingData(prev => ({ ...prev, ...newData }));
  };

  const value = {
    // Farmers
    farmers,
    setFarmers,
    addFarmer,
    updateFarmer,
    deleteFarmer,
    // Suppliers
    suppliers,
    setSuppliers,
    addSupplier,
    deleteSupplier,
    // Milk Collection
    milkEntries,
    setMilkEntries,
    addMilkEntry,
    updateMilkEntry,
    deleteMilkEntry,
    // Inventory
    inventoryItems,
    setInventoryItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    // Quality Tests
    qualityTests,
    setQualityTests,
    generateQualityDistribution,
    // Processing Units
    processingUnits,
    setProcessingUnits,
    productionBatches,
    setProductionBatches,
    qualityChecksData,
    setQualityChecksData,
    maintenanceRecordsData,
    setMaintenanceRecordsData,
    // Logistics
    vehicles,
    setVehicles,
    deliveries,
    setDeliveries,
    // Sales & Retailers
    retailers,
    setRetailers,
    addRetailer,
    updateRetailer,
    deleteRetailer,
    sales,
    setSales,
    addSale,
    updateSale,
    deleteSale,
    // Workforce
    employees,
    setEmployees,
    // Reviews
    reviews,
    setReviews,
    // Metrics Data
    employeeData,
    setEmployeeData,
    updateEmployeeData,
    processingData,
    setProcessingData,
    updateProcessingData,
    // COMPLIANCE DATA
    complianceRecords,
    setComplianceRecords,
    certifications,
    setCertifications,
    audits,
    setAudits,
    // MODIFIED: Network Growth Data
    generateNetworkGrowthData,
    // Calculated Metrics
    calculateEmployeeSatisfaction,
    calculateSustainabilityIndex,
    calculateProcessingEfficiency
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
