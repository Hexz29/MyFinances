import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatCurrency, formatDate } from '@/lib/utils'
import { supabase } from '@/integrations/supabase/client'
import { Plus, Search, Filter, TrendingUp, TrendingDown } from 'lucide-react'
import type { Transaction } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

export function Transactions() {
  // Start with no transactions (cleared/mocked data removed)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  // Load transactions from Supabase on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from<Transaction>('transactions')
          .select('*')
          .order('date', { ascending: false })

        if (error) {
          console.error('Failed to load transactions from Supabase', error)
        } else if (data) {
          setTransactions(data)
        }
      } catch (e) {
        console.error('Unexpected error loading transactions', e)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const { user } = useAuth()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')

  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as 'income' | 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  const categories = {
    income: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
    expense: ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Casa', 'Outros']
  }

  const filteredTransactions = transactions.filter((transaction: Transaction) => {
  const matchesSearch = (transaction.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
             (transaction.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || transaction.type === filterType
    return matchesSearch && matchesType
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const amountValue = Number(newTransaction.amount)
    const userId = user.id

    const payload = {
      user_id: userId,
      account_id: 'acc1',
      type: newTransaction.type,
      category: newTransaction.category,
      amount: isFinite(amountValue) ? amountValue : 0,
      description: newTransaction.description,
      date: newTransaction.date
    }

    // Optimistic UI: add a temporary id and show while inserting
    const temp: Transaction = {
      id: `temp-${Date.now()}`,
      ...payload,
      created_at: new Date().toISOString()
    }

    setTransactions((prev: Transaction[]) => [temp, ...prev])
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const { data, error } = await supabase.from('transactions').insert([payload]).select().single()
      if (error) {
        console.error('Failed to insert transaction', error)
        setSubmitError(error.message || 'Erro ao salvar transação')
        // rollback optimistic update
        setTransactions((prev: Transaction[]) => prev.filter((t: Transaction) => t.id !== temp.id))
        return
      }

      if (data) {
        // replace temp item with saved record
        setTransactions((prev: Transaction[]) => [data as Transaction, ...prev.filter((t: Transaction) => t.id !== temp.id)])
        setNewTransaction({
          type: 'expense',
          category: '',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        })
        setIsDialogOpen(false)
      }
    } catch (e: any) {
      console.error('Unexpected error inserting transaction', e)
      setSubmitError(e?.message || 'Erro inesperado ao salvar')
      setTransactions((prev: Transaction[]) => prev.filter((t: Transaction) => t.id !== temp.id))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transações</h1>
          <p className="text-gray-600 mt-2">Gerencie suas receitas e despesas</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
              <DialogDescription>
                Adicione uma nova receita ou despesa
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select 
                  value={newTransaction.type} 
                  onValueChange={(value: 'income' | 'expense') => 
                    setNewTransaction({...newTransaction, type: value, category: ''})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select 
                  value={newTransaction.category} 
                  onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[newTransaction.type].map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Descrição da transação"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Adicionar Transação
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={(value: 'all' | 'income' | 'expense') => setFilterType(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transação(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma transação encontrada
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className={`h-4 w-4 text-green-600`} />
                      ) : (
                        <TrendingDown className={`h-4 w-4 text-red-600`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount) || 0)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(new Date(transaction.date))}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}