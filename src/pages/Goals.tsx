import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Target, Calendar, TrendingUp } from 'lucide-react'
import type { Goal } from '@/types'

export function Goals() {
  // Start with no goals (cleared mock data)
  const [goals, setGoals] = useState<Goal[]>([])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: '',
    target_amount: '',
    current_amount: '',
    target_date: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const goal: Goal = {
      id: Date.now().toString(),
      user_id: 'user1',
      name: newGoal.name,
      target_amount: parseFloat(newGoal.target_amount),
      current_amount: parseFloat(newGoal.current_amount) || 0,
      target_date: newGoal.target_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setGoals([...goals, goal])
    setNewGoal({
      name: '',
      target_amount: '',
      current_amount: '',
      target_date: ''
    })
    setIsDialogOpen(false)
  }

  const updateGoalAmount = (goalId: string, amount: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, current_amount: goal.current_amount + amount, updated_at: new Date().toISOString() }
        : goal
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Metas Financeiras</h1>
          <p className="text-gray-600 mt-2">Defina e acompanhe seus objetivos financeiros</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Meta Financeira</DialogTitle>
              <DialogDescription>
                Defina um objetivo financeiro para se manter motivado
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Meta</Label>
                <Input
                  id="name"
                  placeholder="Ex: Reserva de emergência"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_amount">Valor Objetivo</Label>
                <Input
                  id="target_amount"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={newGoal.target_amount}
                  onChange={(e) => setNewGoal({...newGoal, target_amount: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current_amount">Valor Atual (opcional)</Label>
                <Input
                  id="current_amount"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={newGoal.current_amount}
                  onChange={(e) => setNewGoal({...newGoal, current_amount: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_date">Data Objetivo</Label>
                <Input
                  id="target_date"
                  type="date"
                  value={newGoal.target_date}
                  onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Criar Meta
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const percentage = (goal.current_amount / goal.target_amount) * 100
          const isCompleted = percentage >= 100
          const daysRemaining = Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          
          return (
            <Card key={goal.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{goal.name}</span>
                  <Target className={`h-5 w-5 ${isCompleted ? 'text-green-600' : 'text-blue-600'}`} />
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {daysRemaining > 0 ? `${daysRemaining} dias restantes` : 'Meta vencida'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span className="font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Atual</span>
                    <span className="font-semibold">{formatCurrency(goal.current_amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Objetivo</span>
                    <span className="font-semibold">{formatCurrency(goal.target_amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Restante</span>
                    <span className={`font-semibold ${
                      goal.target_amount - goal.current_amount <= 0 ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {formatCurrency(Math.max(0, goal.target_amount - goal.current_amount))}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        const amount = prompt('Quanto deseja adicionar?')
                        if (amount && !isNaN(parseFloat(amount))) {
                          updateGoalAmount(goal.id, parseFloat(amount))
                        }
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>

                {isCompleted && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <p className="text-green-800 font-medium text-sm">
                      🎉 Meta atingida! Parabéns!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {goals.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma meta criada
              </h3>
              <p className="text-gray-500 mb-4">
                Defina objetivos financeiros para se manter motivado
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Criar Primeira Meta
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}