import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, Plus, Calendar, FileText, Download, X } from 'lucide-react-native';
import { theme } from '@/components/designSystem';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FormField from '@/components/FormField';
import Dropdown from '@/components/Dropdown';

interface FinancialTransaction {
  id: number;
  date: string;
  type: 'income' | 'expense' | 'depreciation';
  amount: number;
  currency: string;
  description: string;
  account: string;
  category: string;
  subcategory?: string;
  fieldId?: number;
  fieldName?: string;
  cropId?: number;
  cropName?: string;
  isReconciled: boolean;
  reconciliationDate?: string;
  attachments: string[];
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

interface Budget {
  id: number;
  name: string;
  year: number;
  totalBudget: number;
  categories: BudgetCategory[];
  actualSpent: number;
  variance: number;
  variancePercentage: number;
  status: 'draft' | 'approved' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface BudgetCategory {
  id: number;
  name: string;
  budgetedAmount: number;
  actualAmount: number;
  variance: number;
  variancePercentage: number;
  subcategories: BudgetSubcategory[];
}

interface BudgetSubcategory {
  id: number;
  name: string;
  budgetedAmount: number;
  actualAmount: number;
  variance: number;
  variancePercentage: number;
}

interface FinancialStatement {
  id: number;
  type: 'profit_loss' | 'balance_sheet' | 'cash_flow';
  period: string;
  startDate: string;
  endDate: string;
  data: any;
  generatedAt: string;
}

interface ProfitabilityAnalysis {
  fieldId: number;
  fieldName: string;
  cropId: number;
  cropName: string;
  totalRevenue: number;
  totalCosts: number;
  grossMargin: number;
  grossMarginPercentage: number;
  netMargin: number;
  netMarginPercentage: number;
  roi: number;
  costPerHectare: number;
  revenuePerHectare: number;
  breakEvenPoint: number;
  period: string;
}

interface FinancialManagementInterfaceProps {
  onDataChange?: (data: { transactions: FinancialTransaction[]; budgets: Budget[] }) => void;
}

export default function FinancialManagementInterface({ onDataChange }: FinancialManagementInterfaceProps) {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [profitabilityData, setProfitabilityData] = useState<ProfitabilityAnalysis[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);
  const [selectedBudget, setBudget] = useState<Budget | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budgets' | 'reports' | 'profitability'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('current_year');
  const [transactionFormData, setTransactionFormData] = useState({
    date: '',
    type: 'expense',
    amount: '',
    description: '',
    account: '',
    category: '',
    subcategory: '',
    fieldId: '',
    cropId: '',
  });

  // Mock data for accounts and categories
  const accounts = [
    { id: 1, name: 'Operating Account', type: 'asset' },
    { id: 2, name: 'Savings Account', type: 'asset' },
    { id: 3, name: 'Equipment Account', type: 'asset' },
    { id: 4, name: 'Accounts Payable', type: 'liability' },
    { id: 5, name: 'Accounts Receivable', type: 'asset' },
  ];

  const expenseCategories = [
    { 
      name: 'Seeds & Planting', 
      subcategories: ['Seeds', 'Seedlings', 'Planting Labor', 'Planting Equipment'] 
    },
    { 
      name: 'Fertilizers & Nutrients', 
      subcategories: ['Organic Fertilizers', 'Synthetic Fertilizers', 'Micronutrients', 'Soil Amendments'] 
    },
    { 
      name: 'Pest & Disease Control', 
      subcategories: ['Pesticides', 'Fungicides', 'Herbicides', 'Biological Controls'] 
    },
    { 
      name: 'Labor', 
      subcategories: ['Regular Labor', 'Seasonal Labor', 'Overtime', 'Benefits'] 
    },
    { 
      name: 'Equipment & Machinery', 
      subcategories: ['Fuel', 'Maintenance', 'Repairs', 'Depreciation'] 
    },
    { 
      name: 'Utilities', 
      subcategories: ['Electricity', 'Water', 'Internet', 'Phone'] 
    },
  ];

  const incomeCategories = [
    { 
      name: 'Crop Sales', 
      subcategories: ['Grain Sales', 'Vegetable Sales', 'Fruit Sales', 'Organic Premium'] 
    },
    { 
      name: 'Livestock', 
      subcategories: ['Cattle Sales', 'Dairy Products', 'Poultry', 'Other Livestock'] 
    },
    { 
      name: 'Government Programs', 
      subcategories: ['Subsidies', 'Conservation Programs', 'Crop Insurance', 'Disaster Relief'] 
    },
    { 
      name: 'Other Income', 
      subcategories: ['Equipment Rental', 'Consulting', 'Agritourism', 'Land Rental'] 
    },
  ];

  const fields = [
    { id: 1, name: 'Field A - North', area: 25.5 },
    { id: 2, name: 'Field B - South', area: 18.2 },
    { id: 3, name: 'Field C - East', area: 32.1 },
  ];

  const crops = [
    { id: 1, name: 'Corn', fieldId: 1 },
    { id: 2, name: 'Wheat', fieldId: 2 },
    { id: 3, name: 'Soybeans', fieldId: 3 },
  ];

  useEffect(() => {
    loadFinancialData();
  }, [selectedPeriod]);

  const loadFinancialData = async () => {
    await Promise.all([
      loadTransactions(),
      loadBudgets(),
      loadProfitabilityData(),
    ]);
  };

  const loadTransactions = async () => {
    // Mock data - in real app, this would fetch from API
    const mockTransactions: FinancialTransaction[] = [
      {
        id: 1,
        date: '2024-03-15',
        type: 'expense',
        amount: 5000,
        currency: 'USD',
        description: 'Corn seeds purchase',
        account: 'Operating Account',
        category: 'Seeds & Planting',
        subcategory: 'Seeds',
        fieldId: 1,
        fieldName: 'Field A - North',
        cropId: 1,
        cropName: 'Corn',
        isReconciled: true,
        reconciliationDate: '2024-03-16',
        attachments: ['invoice_001.pdf'],
        createdBy: 1,
        createdAt: '2024-03-15',
        updatedAt: '2024-03-15',
      },
      {
        id: 2,
        date: '2024-03-10',
        type: 'income',
        amount: 25000,
        currency: 'USD',
        description: 'Wheat harvest sale',
        account: 'Operating Account',
        category: 'Crop Sales',
        subcategory: 'Grain Sales',
        fieldId: 2,
        fieldName: 'Field B - South',
        cropId: 2,
        cropName: 'Wheat',
        isReconciled: true,
        reconciliationDate: '2024-03-11',
        attachments: ['receipt_001.pdf'],
        createdBy: 1,
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10',
      },
      {
        id: 3,
        date: '2024-03-08',
        type: 'expense',
        amount: 3500,
        currency: 'USD',
        description: 'Fertilizer application',
        account: 'Operating Account',
        category: 'Fertilizers & Nutrients',
        subcategory: 'Organic Fertilizers',
        fieldId: 1,
        fieldName: 'Field A - North',
        isReconciled: false,
        attachments: [],
        createdBy: 1,
        createdAt: '2024-03-08',
        updatedAt: '2024-03-08',
      },
    ];
    setTransactions(mockTransactions);
  };

  const loadBudgets = async () => {
    // Mock budget data
    const mockBudgets: Budget[] = [
      {
        id: 1,
        name: '2024 Annual Budget',
        year: 2024,
        totalBudget: 150000,
        categories: [
          {
            id: 1,
            name: 'Seeds & Planting',
            budgetedAmount: 25000,
            actualAmount: 18500,
            variance: 6500,
            variancePercentage: 26,
            subcategories: [
              {
                id: 1,
                name: 'Seeds',
                budgetedAmount: 15000,
                actualAmount: 12000,
                variance: 3000,
                variancePercentage: 20,
              },
              {
                id: 2,
                name: 'Planting Labor',
                budgetedAmount: 10000,
                actualAmount: 6500,
                variance: 3500,
                variancePercentage: 35,
              },
            ],
          },
          {
            id: 2,
            name: 'Fertilizers & Nutrients',
            budgetedAmount: 30000,
            actualAmount: 32500,
            variance: -2500,
            variancePercentage: -8.3,
            subcategories: [
              {
                id: 3,
                name: 'Organic Fertilizers',
                budgetedAmount: 20000,
                actualAmount: 22000,
                variance: -2000,
                variancePercentage: -10,
              },
              {
                id: 4,
                name: 'Synthetic Fertilizers',
                budgetedAmount: 10000,
                actualAmount: 10500,
                variance: -500,
                variancePercentage: -5,
              },
            ],
          },
        ],
        actualSpent: 95000,
        variance: 55000,
        variancePercentage: 36.7,
        status: 'active',
        createdAt: '2024-01-01',
        updatedAt: '2024-03-15',
      },
    ];
    setBudgets(mockBudgets);
  };

  const loadProfitabilityData = async () => {
    // Mock profitability data
    const mockProfitability: ProfitabilityAnalysis[] = [
      {
        fieldId: 1,
        fieldName: 'Field A - North',
        cropId: 1,
        cropName: 'Corn',
        totalRevenue: 45000,
        totalCosts: 28000,
        grossMargin: 17000,
        grossMarginPercentage: 37.8,
        netMargin: 15000,
        netMarginPercentage: 33.3,
        roi: 53.6,
        costPerHectare: 1098,
        revenuePerHectare: 1765,
        breakEvenPoint: 0.62,
        period: '2024-Q1',
      },
      {
        fieldId: 2,
        fieldName: 'Field B - South',
        cropId: 2,
        cropName: 'Wheat',
        totalRevenue: 32000,
        totalCosts: 22000,
        grossMargin: 10000,
        grossMarginPercentage: 31.3,
        netMargin: 8500,
        netMarginPercentage: 26.6,
        roi: 38.6,
        costPerHectare: 1209,
        revenuePerHectare: 1758,
        breakEvenPoint: 0.69,
        period: '2024-Q1',
      },
    ];
    setProfitabilityData(mockProfitability);
  };

  const handleCreateTransaction = () => {
    setTransactionFormData({
      date: '',
      type: 'expense',
      amount: '',
      description: '',
      account: '',
      category: '',
      subcategory: '',
      fieldId: '',
      cropId: '',
    });
    setSelectedTransaction(null);
    setShowTransactionModal(true);
  };

  const handleSaveTransaction = () => {
    if (!transactionFormData.date || !transactionFormData.amount || !transactionFormData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newTransaction: FinancialTransaction = {
      id: selectedTransaction?.id || Date.now(),
      date: transactionFormData.date,
      type: transactionFormData.type as any,
      amount: parseFloat(transactionFormData.amount),
      currency: 'USD',
      description: transactionFormData.description,
      account: transactionFormData.account,
      category: transactionFormData.category,
      subcategory: transactionFormData.subcategory,
      fieldId: transactionFormData.fieldId ? parseInt(transactionFormData.fieldId) : undefined,
      fieldName: fields.find(f => f.id.toString() === transactionFormData.fieldId)?.name,
      cropId: transactionFormData.cropId ? parseInt(transactionFormData.cropId) : undefined,
      cropName: crops.find(c => c.id.toString() === transactionFormData.cropId)?.name,
      isReconciled: false,
      attachments: [],
      createdBy: 1,
      createdAt: selectedTransaction?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (selectedTransaction) {
      setTransactions(prev => prev.map(t => t.id === selectedTransaction.id ? newTransaction : t));
    } else {
      setTransactions(prev => [...prev, newTransaction]);
    }

    setShowTransactionModal(false);
    Alert.alert('Success', 'Transaction saved successfully');
  };

  const calculateFinancialSummary = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin,
    };
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return theme.colors.success[500];
    if (variance < 0) return theme.colors.error[500];
    return theme.colors.neutral[500];
  };

  const renderOverview = () => {
    const summary = calculateFinancialSummary();
    
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Financial Summary Cards */}
        <View style={styles.summaryGrid}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <TrendingUp size={24} color={theme.colors.success[500]} />
              <Text style={styles.summaryTitle}>Total Income</Text>
            </View>
            <Text style={styles.summaryValue}>${summary.totalIncome.toLocaleString()}</Text>
            <Text style={styles.summaryChange}>+12.5% from last period</Text>
          </Card>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <TrendingDown size={24} color={theme.colors.error[500]} />
              <Text style={styles.summaryTitle}>Total Expenses</Text>
            </View>
            <Text style={styles.summaryValue}>${summary.totalExpenses.toLocaleString()}</Text>
            <Text style={styles.summaryChange}>-8.3% from last period</Text>
          </Card>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <DollarSign size={24} color={theme.colors.primary[500]} />
              <Text style={styles.summaryTitle}>Net Profit</Text>
            </View>
            <Text style={[styles.summaryValue, { color: summary.netProfit >= 0 ? theme.colors.success[500] : theme.colors.error[500] }]}>
              ${summary.netProfit.toLocaleString()}
            </Text>
            <Text style={styles.summaryChange}>Margin: {summary.profitMargin.toFixed(1)}%</Text>
          </Card>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <PieChart size={24} color={theme.colors.warning[500]} />
              <Text style={styles.summaryTitle}>Budget Variance</Text>
            </View>
            <Text style={styles.summaryValue}>
              {budgets.length > 0 ? `${budgets[0].variancePercentage.toFixed(1)}%` : 'N/A'}
            </Text>
            <Text style={styles.summaryChange}>Under budget</Text>
          </Card>
        </View>

        {/* Recent Transactions */}
        <Card style={styles.recentTransactions}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Button
              title="View All"
              onPress={() => setActiveTab('transactions')}
              variant="ghost"
              size="sm"
            />
          </View>
          {transactions.slice(0, 5).map(transaction => (
            <View key={transaction.id} style={styles.transactionRow}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text style={[
                  styles.transactionValue,
                  { color: transaction.type === 'income' ? theme.colors.success[500] : theme.colors.error[500] }
                ]}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </Text>
                <Text style={styles.transactionCategory}>{transaction.category}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Budget Overview */}
        {budgets.length > 0 && (
          <Card style={styles.budgetOverview}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Budget Overview</Text>
              <Button
                title="View Details"
                onPress={() => setActiveTab('budgets')}
                variant="ghost"
                size="sm"
              />
            </View>
            <View style={styles.budgetProgress}>
              <View style={styles.budgetBar}>
                <View 
                  style={[
                    styles.budgetFill, 
                    { width: `${(budgets[0].actualSpent / budgets[0].totalBudget) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.budgetText}>
                ${budgets[0].actualSpent.toLocaleString()} of ${budgets[0].totalBudget.toLocaleString()} spent
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>
    );
  };

  const renderTransactionCard = (transaction: FinancialTransaction) => (
    <Card key={transaction.id} style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{transaction.description}</Text>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
        </View>
        <View style={styles.transactionMeta}>
          <Text style={[
            styles.transactionValue,
            { color: transaction.type === 'income' ? theme.colors.success[500] : theme.colors.error[500] }
          ]}>
            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
          </Text>
          <View style={[
            styles.reconciliationBadge,
            { backgroundColor: transaction.isReconciled ? theme.colors.success[500] + '20' : theme.colors.warning[500] + '20' }
          ]}>
            <Text style={[
              styles.reconciliationText,
              { color: transaction.isReconciled ? theme.colors.success[500] : theme.colors.warning[500] }
            ]}>
              {transaction.isReconciled ? 'Reconciled' : 'Pending'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.transactionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailValue}>{transaction.category}</Text>
        </View>
        {transaction.subcategory && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Subcategory:</Text>
            <Text style={styles.detailValue}>{transaction.subcategory}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Account:</Text>
          <Text style={styles.detailValue}>{transaction.account}</Text>
        </View>
        {transaction.fieldName && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Field:</Text>
            <Text style={styles.detailValue}>{transaction.fieldName}</Text>
          </View>
        )}
      </View>

      <View style={styles.transactionFooter}>
        <Button
          title="Edit"
          onPress={() => {
            setSelectedTransaction(transaction);
            setTransactionFormData({
              date: transaction.date,
              type: transaction.type,
              amount: transaction.amount.toString(),
              description: transaction.description,
              account: transaction.account,
              category: transaction.category,
              subcategory: transaction.subcategory || '',
              fieldId: transaction.fieldId?.toString() || '',
              cropId: transaction.cropId?.toString() || '',
            });
            setShowTransactionModal(true);
          }}
          variant="outline"
          size="sm"
        />
        {!transaction.isReconciled && (
          <Button
            title="Reconcile"
            onPress={() => {
              setTransactions(prev => prev.map(t => 
                t.id === transaction.id 
                  ? { ...t, isReconciled: true, reconciliationDate: new Date().toISOString() }
                  : t
              ));
              Alert.alert('Success', 'Transaction reconciled');
            }}
            variant="ghost"
            size="sm"
          />
        )}
      </View>
    </Card>
  );

  const renderBudgetCard = (budget: Budget) => (
    <Card key={budget.id} style={styles.budgetCard}>
      <View style={styles.budgetHeader}>
        <Text style={styles.budgetName}>{budget.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getBudgetStatusColor(budget.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getBudgetStatusColor(budget.status) }]}>
            {budget.status.charAt(0).toUpperCase() + budget.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.budgetSummary}>
        <View style={styles.budgetProgress}>
          <View style={styles.budgetBar}>
            <View 
              style={[
                styles.budgetFill, 
                { width: `${Math.min((budget.actualSpent / budget.totalBudget) * 100, 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.budgetText}>
            ${budget.actualSpent.toLocaleString()} of ${budget.totalBudget.toLocaleString()}
          </Text>
        </View>
        <View style={styles.budgetVariance}>
          <Text style={styles.varianceLabel}>Variance:</Text>
          <Text style={[styles.varianceValue, { color: getVarianceColor(budget.variance) }]}>
            {budget.variance > 0 ? '+' : ''}${budget.variance.toLocaleString()} ({budget.variancePercentage.toFixed(1)}%)
          </Text>
        </View>
      </View>

      <View style={styles.budgetCategories}>
        <Text style={styles.categoriesTitle}>Top Categories:</Text>
        {budget.categories.slice(0, 3).map(category => (
          <View key={category.id} style={styles.categoryRow}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={[styles.categoryVariance, { color: getVarianceColor(category.variance) }]}>
              {category.variancePercentage > 0 ? '+' : ''}{category.variancePercentage.toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );

  const renderProfitabilityCard = (analysis: ProfitabilityAnalysis) => (
    <Card key={`${analysis.fieldId}-${analysis.cropId}`} style={styles.profitabilityCard}>
      <View style={styles.profitabilityHeader}>
        <Text style={styles.profitabilityTitle}>{analysis.fieldName}</Text>
        <Text style={styles.profitabilityCrop}>{analysis.cropName}</Text>
      </View>

      <View style={styles.profitabilityMetrics}>
        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Revenue</Text>
            <Text style={styles.metricValue}>${analysis.totalRevenue.toLocaleString()}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Costs</Text>
            <Text style={styles.metricValue}>${analysis.totalCosts.toLocaleString()}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Net Margin</Text>
            <Text style={[styles.metricValue, { color: theme.colors.success[500] }]}>
              ${analysis.netMargin.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Margin %</Text>
            <Text style={styles.metricValue}>{analysis.netMarginPercentage.toFixed(1)}%</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>ROI</Text>
            <Text style={styles.metricValue}>{analysis.roi.toFixed(1)}%</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Cost/Ha</Text>
            <Text style={styles.metricValue}>${analysis.costPerHectare.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </Card>
  );

  const getBudgetStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.colors.success[500];
      case 'approved': return theme.colors.primary[500];
      case 'completed': return theme.colors.neutral[500];
      case 'draft': return theme.colors.warning[500];
      default: return theme.colors.neutral[500];
    }
  };

  const renderTabButton = (tab: string, title: string) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab as any)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Management</Text>
        <View style={styles.headerActions}>
          <Dropdown
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
            options={[
              { label: 'Current Year', value: 'current_year' },
              { label: 'Last Year', value: 'last_year' },
              { label: 'Current Quarter', value: 'current_quarter' },
              { label: 'Last Quarter', value: 'last_quarter' },
              { label: 'Current Month', value: 'current_month' },
            ]}
            style={styles.periodDropdown}
          />
          <Button
            title="New Transaction"
            onPress={handleCreateTransaction}
            icon={<Plus size={16} color={theme.colors.neutral[50]} />}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
        {renderTabButton('overview', 'Overview')}
        {renderTabButton('transactions', 'Transactions')}
        {renderTabButton('budgets', 'Budgets')}
        {renderTabButton('profitability', 'Profitability')}
        {renderTabButton('reports', 'Reports')}
      </ScrollView>

      <View style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        
        {activeTab === 'transactions' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {transactions.length === 0 ? (
              <Card style={styles.emptyState}>
                <FileText size={48} color={theme.colors.neutral[400]} />
                <Text style={styles.emptyStateText}>No transactions yet</Text>
                <Text style={styles.emptyStateSubtext}>Add your first transaction to get started</Text>
                <Button
                  title="Add Transaction"
                  onPress={handleCreateTransaction}
                  style={styles.emptyStateButton}
                />
              </Card>
            ) : (
              transactions.map(renderTransactionCard)
            )}
          </ScrollView>
        )}

        {activeTab === 'budgets' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {budgets.length === 0 ? (
              <Card style={styles.emptyState}>
                <BarChart3 size={48} color={theme.colors.neutral[400]} />
                <Text style={styles.emptyStateText}>No budgets yet</Text>
                <Text style={styles.emptyStateSubtext}>Create your first budget to track spending</Text>
                <Button
                  title="Create Budget"
                  onPress={() => setShowBudgetModal(true)}
                  style={styles.emptyStateButton}
                />
              </Card>
            ) : (
              budgets.map(renderBudgetCard)
            )}
          </ScrollView>
        )}

        {activeTab === 'profitability' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {profitabilityData.length === 0 ? (
              <Card style={styles.emptyState}>
                <TrendingUp size={48} color={theme.colors.neutral[400]} />
                <Text style={styles.emptyStateText}>No profitability data yet</Text>
                <Text style={styles.emptyStateSubtext}>Add transactions to see profitability analysis</Text>
              </Card>
            ) : (
              profitabilityData.map(renderProfitabilityCard)
            )}
          </ScrollView>
        )}

        {activeTab === 'reports' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Card style={styles.reportsCard}>
              <Text style={styles.sectionTitle}>Financial Reports</Text>
              <View style={styles.reportsList}>
                <TouchableOpacity style={styles.reportItem}>
                  <FileText size={20} color={theme.colors.primary[500]} />
                  <Text style={styles.reportName}>Profit & Loss Statement</Text>
                  <Download size={16} color={theme.colors.neutral[500]} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.reportItem}>
                  <FileText size={20} color={theme.colors.primary[500]} />
                  <Text style={styles.reportName}>Balance Sheet</Text>
                  <Download size={16} color={theme.colors.neutral[500]} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.reportItem}>
                  <FileText size={20} color={theme.colors.primary[500]} />
                  <Text style={styles.reportName}>Cash Flow Statement</Text>
                  <Download size={16} color={theme.colors.neutral[500]} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.reportItem}>
                  <FileText size={20} color={theme.colors.primary[500]} />
                  <Text style={styles.reportName}>Budget vs Actual Report</Text>
                  <Download size={16} color={theme.colors.neutral[500]} />
                </TouchableOpacity>
              </View>
            </Card>
          </ScrollView>
        )}
      </View>

      {/* Add Transaction Modal */}
      <Modal visible={showTransactionModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </Text>
            <TouchableOpacity onPress={() => setShowTransactionModal(false)}>
              <X size={24} color={theme.colors.neutral[500]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <FormField
              label="Date"
              value={transactionFormData.date}
              onChangeText={(text) => setTransactionFormData(prev => ({ ...prev, date: text }))}
              placeholder="YYYY-MM-DD"
              required
            />

            <Dropdown
              label="Type"
              value={transactionFormData.type}
              onValueChange={(value) => setTransactionFormData(prev => ({ ...prev, type: value }))}
              options={[
                { label: 'Income', value: 'income' },
                { label: 'Expense', value: 'expense' },
                { label: 'Depreciation', value: 'depreciation' },
              ]}
              required
            />

            <FormField
              label="Amount"
              value={transactionFormData.amount}
              onChangeText={(text) => setTransactionFormData(prev => ({ ...prev, amount: text }))}
              placeholder="0.00"
              keyboardType="numeric"
              required
            />

            <FormField
              label="Description"
              value={transactionFormData.description}
              onChangeText={(text) => setTransactionFormData(prev => ({ ...prev, description: text }))}
              placeholder="Transaction description"
              required
            />

            <Dropdown
              label="Account"
              value={transactionFormData.account}
              onValueChange={(value) => setTransactionFormData(prev => ({ ...prev, account: value }))}
              options={accounts.map(a => ({ label: a.name, value: a.name }))}
              placeholder="Select account"
            />

            <Dropdown
              label="Category"
              value={transactionFormData.category}
              onValueChange={(value) => setTransactionFormData(prev => ({ ...prev, category: value, subcategory: '' }))}
              options={
                transactionFormData.type === 'income' 
                  ? incomeCategories.map(c => ({ label: c.name, value: c.name }))
                  : expenseCategories.map(c => ({ label: c.name, value: c.name }))
              }
              placeholder="Select category"
            />

            {transactionFormData.category && (
              <Dropdown
                label="Subcategory"
                value={transactionFormData.subcategory}
                onValueChange={(value) => setTransactionFormData(prev => ({ ...prev, subcategory: value }))}
                options={
                  (transactionFormData.type === 'income' ? incomeCategories : expenseCategories)
                    .find(c => c.name === transactionFormData.category)
                    ?.subcategories.map(s => ({ label: s, value: s })) || []
                }
                placeholder="Select subcategory"
              />
            )}

            <Dropdown
              label="Field (Optional)"
              value={transactionFormData.fieldId}
              onValueChange={(value) => setTransactionFormData(prev => ({ ...prev, fieldId: value }))}
              options={fields.map(f => ({ label: f.name, value: f.id.toString() }))}
              placeholder="Select field"
            />

            {transactionFormData.fieldId && (
              <Dropdown
                label="Crop (Optional)"
                value={transactionFormData.cropId}
                onValueChange={(value) => setTransactionFormData(prev => ({ ...prev, cropId: value }))}
                options={crops
                  .filter(c => c.fieldId.toString() === transactionFormData.fieldId)
                  .map(c => ({ label: c.name, value: c.id.toString() }))}
                placeholder="Select crop"
              />
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              onPress={() => setShowTransactionModal(false)}
              variant="outline"
              style={styles.modalButton}
            />
            <Button
              title="Save Transaction"
              onPress={handleSaveTransaction}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  periodDropdown: {
    minWidth: 150,
  },
  tabContainer: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabButton: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: theme.colors.primary[500],
  },
  tabText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    fontWeight: theme.typography.fontWeight.medium,
  },
  tabTextActive: {
    color: theme.colors.primary[500],
    fontWeight: theme.typography.fontWeight.semibold,
  },
  content: {
    flex: 1,
    padding: theme.spacing[4],
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  summaryCard: {
    width: '48%',
    padding: theme.spacing[4],
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  summaryTitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing[2],
  },
  summaryValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  summaryChange: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral[500],
  },
  recentTransactions: {
    marginBottom: theme.spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[100],
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  transactionDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[500],
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionValue: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing[1],
  },
  transactionCategory: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[500],
  },
  budgetOverview: {
    marginBottom: theme.spacing[4],
  },
  budgetProgress: {
    marginBottom: theme.spacing[2],
  },
  budgetBar: {
    height: 8,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: theme.radii.full,
    marginBottom: theme.spacing[2],
  },
  budgetFill: {
    height: '100%',
    backgroundColor: theme.colors.primary[500],
    borderRadius: theme.radii.full,
  },
  budgetText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    textAlign: 'center',
  },
  transactionCard: {
    marginBottom: theme.spacing[3],
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[3],
  },
  transactionMeta: {
    alignItems: 'flex-end',
  },
  reconciliationBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.radii.sm,
    marginTop: theme.spacing[1],
  },
  reconciliationText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  transactionDetails: {
    marginBottom: theme.spacing[3],
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    fontWeight: theme.typography.fontWeight.medium,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  transactionFooter: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  budgetCard: {
    marginBottom: theme.spacing[3],
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  budgetName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.radii.sm,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  budgetSummary: {
    marginBottom: theme.spacing[3],
  },
  budgetVariance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing[2],
  },
  varianceLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    fontWeight: theme.typography.fontWeight.medium,
  },
  varianceValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  budgetCategories: {
    marginTop: theme.spacing[3],
  },
  categoriesTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[2],
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  categoryName: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
  },
  categoryVariance: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  profitabilityCard: {
    marginBottom: theme.spacing[3],
  },
  profitabilityHeader: {
    marginBottom: theme.spacing[3],
  },
  profitabilityTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing[1],
  },
  profitabilityCrop: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
  },
  profitabilityMetrics: {
    gap: theme.spacing[3],
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[1],
  },
  metricValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  reportsCard: {
    marginBottom: theme.spacing[4],
  },
  reportsList: {
    marginTop: theme.spacing[3],
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[3],
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing[2],
  },
  reportName: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing[3],
  },
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing[8],
  },
  emptyStateText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[2],
  },
  emptyStateSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[500],
    textAlign: 'center',
    marginBottom: theme.spacing[4],
  },
  emptyStateButton: {
    marginTop: theme.spacing[2],
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  modalContent: {
    flex: 1,
    padding: theme.spacing[4],
  },
  modalFooter: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    padding: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  modalButton: {
    flex: 1,
  },
});