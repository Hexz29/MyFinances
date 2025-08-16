import React, { useState, } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, CreditCard, Wallet, TrendingUp, Building } from 'lucide-react'
import type { Account } from '@/types'

export function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      user_id: 'user1',
      name: 'Conta Corrente Principal',
      type: 'checking',
      balance: 5420.50,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      user_id: 'user1',
      name: 'Poupança',
      type: 'savings',
      balance: 8500.00,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '3',
      user_id: 'user1',
      name: 'Investimentos',
      type: 'investment',
      balance: 12300.75,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    }
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'checking' as Account['type'],
    balance: ''
  })

  const accountTypes = {
    checking: { label: 'Conta Corrente', icon: CreditCard, color: 'text-blue-600' },
    savings: { label: 'Poupança', icon: Wallet, color: 'text-green-600' },
    investment: { label: 'Investimentos', icon: TrendingUp, color: 'text-purple-600' },
    credit: { label: 'Cartão de Crédito', icon: Building, color: 'text-red-600' }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const account: Account = {
      id: Date.now().toString(),
      user_id: 'user1',
      name: newAccount.name,
      type: newAccount.type,
      balance: parseFloat(newAccount.balance) || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setAccounts([...accounts, account])
    setNewAccount({
      name: '',
      type: 'checking',
      balance: ''
    })
    setIsDialogOpen(false)
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contas</h1>
          <p className="text-gray-600 mt-2">Gerencie suas contas e saldos</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Conta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Conta</DialogTitle>
              <DialogDescription>
                Adicione uma nova conta para gerenciar
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Conta</Label>
                <Input
                  id="name"
                  placeholder="Ex: Conta Corrente Banco X"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Conta</Label>
                <Select 
                  value={newAccount.type} 
                  onValueChange={(value: Account['type']) => setNewAccount({...newAccount, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(accountTypes).map(([key, type]) => (
                      <SelectItem key={key} value={key}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="balance">Saldo Inicial</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount({...newAccount, balance: e.target.value})}
                />
              </div>

              <Button type="submit" className="w-full">
                Criar Conta
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Total Balance */}
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <CardHeader>
          <CardTitle className="text-white">Patrimônio Total</CardTitle>
          <CardDescription className="text-emerald-100">
            Soma de todas as suas contas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatCurrency(totalBalance)}</div>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => {
          const AccountIcon = accountTypes[account.type].icon
          
          return (
            <Card key={account.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{account.name}</span>
                  <AccountIcon className={`h-5 w-5 ${accountTypes[account.type].color}`} />
                </CardTitle>
                <CardDescription>
                  {accountTypes[account.type].label}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Saldo</p>
                  <p className={`text-2xl font-bold ${
                    account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(account.balance)}
                  </p>
                </div>

                <div className="text-xs text-gray-500">
                  Atualizado em {formatDate(new Date(account.updated_at))}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      const amount = prompt('Valor para adicionar:')
                      if (amount && !isNaN(parseFloat(amount))) {
                        const updatedAccounts = accounts.map(acc =>
                          acc.id === account.id
                            ? { ...acc, balance: acc.balance + parseFloat(amount), updated_at: new Date().toISOString() }
                            : acc
                        )
                        setAccounts(updatedAccounts)
                      }
                    }}
                  >
                    + Adicionar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      const amount = prompt('Valor para subtrair:')
                      if (amount && !isNaN(parseFloat(amount))) {
                        const updatedAccounts = accounts.map(acc =>
                          acc.id === account.id
                            ? { ...acc, balance: acc.balance - parseFloat(amount), updated_at: new Date().toISOString() }
                            : acc
                        )
                        setAccounts(updatedAccounts)
                      }
                    }}
                  >
                    - Subtrair
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {accounts.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma conta cadastrada
              </h3>
              <p className="text-gray-500 mb-4">
                Adicione suas contas bancárias para começar a gerenciar suas finanças
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Adicionar Primeira Conta
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}