import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  CreditCard,
  PiggyBank
} from 'lucide-react'

export function Dashboard() {
  // Mock data - in a real app, this would come from your database
  const stats = [
    {
      title: 'Saldo Total',
      value: 15420.50,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600'
    },
    {
      title: 'Receitas do Mês',
      value: 8500.00,
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Gastos do Mês',
      value: 3200.75,
      change: '-5.1%',
      trend: 'down',
      icon: TrendingDown,
      color: 'text-red-600'
    },
    {
      title: 'Metas Atingidas',
      value: 3,
      change: '+1',
      trend: 'up',
      icon: Target,
      color: 'text-blue-600'
    }
  ]

  const recentTransactions = [
    { id: 1, description: 'Salário', amount: 5000, type: 'income', date: '2024-01-15' },
    { id: 2, description: 'Supermercado', amount: -250.50, type: 'expense', date: '2024-01-14' },
    { id: 3, description: 'Freelance', amount: 800, type: 'income', date: '2024-01-13' },
    { id: 4, description: 'Combustível', amount: -120, type: 'expense', date: '2024-01-12' },
    { id: 5, description: 'Investimento', amount: -1000, type: 'expense', date: '2024-01-10' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral das suas finanças</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {typeof stat.value === 'number' && stat.title.includes('R$') ? 
                  formatCurrency(stat.value) : 
                  stat.title === 'Metas Atingidas' ? stat.value : formatCurrency(stat.value)
                }
              </div>
              <p className={`text-xs ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Transações Recentes
            </CardTitle>
            <CardDescription>
              Suas últimas movimentações financeiras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className={`font-semibold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5" />
              Orçamento do Mês
            </CardTitle>
            <CardDescription>
              Acompanhe seus gastos por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: 'Alimentação', spent: 800, budget: 1000, color: 'bg-blue-500' },
                { category: 'Transporte', spent: 300, budget: 400, color: 'bg-green-500' },
                { category: 'Lazer', spent: 450, budget: 500, color: 'bg-yellow-500' },
                { category: 'Saúde', spent: 200, budget: 600, color: 'bg-purple-500' }
              ].map((item) => {
                const percentage = (item.spent / item.budget) * 100
                return (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-gray-600">
                        {formatCurrency(item.spent)} / {formatCurrency(item.budget)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.color} transition-all duration-300`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {percentage.toFixed(1)}% utilizado
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}