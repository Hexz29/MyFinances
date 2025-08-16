import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency } from '@/lib/utils'
import { Calculator, TrendingUp, Home, DollarSign } from 'lucide-react'

export function Calculators() {
  // Compound Interest Calculator
  const [compoundData, setCompoundData] = useState({
    principal: '',
    rate: '',
    time: '',
    compound: '12'
  })
  const [compoundResult, setCompoundResult] = useState<number | null>(null)

  // Loan Calculator
  const [loanData, setLoanData] = useState({
    principal: '',
    rate: '',
    time: ''
  })
  const [loanResult, setLoanResult] = useState<{ monthly: number; total: number } | null>(null)

  // Investment Calculator
  const [investmentData, setInvestmentData] = useState({
    monthly: '',
    rate: '',
    time: ''
  })
  const [investmentResult, setInvestmentResult] = useState<{ total: number; invested: number; earnings: number } | null>(null)

  const calculateCompoundInterest = () => {
    const P = parseFloat(compoundData.principal)
    const r = parseFloat(compoundData.rate) / 100
    const n = parseFloat(compoundData.compound)
    const t = parseFloat(compoundData.time)

    if (P && r && n && t) {
      const amount = P * Math.pow((1 + r / n), n * t)
      setCompoundResult(amount)
    }
  }

  const calculateLoan = () => {
    const P = parseFloat(loanData.principal)
    const r = parseFloat(loanData.rate) / 100 / 12
    const n = parseFloat(loanData.time) * 12

    if (P && r && n) {
      const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      const total = monthly * n
      setLoanResult({ monthly, total })
    }
  }

  const calculateInvestment = () => {
    const PMT = parseFloat(investmentData.monthly)
    const r = parseFloat(investmentData.rate) / 100 / 12
    const n = parseFloat(investmentData.time) * 12

    if (PMT && r && n) {
      const total = PMT * (Math.pow(1 + r, n) - 1) / r
      const invested = PMT * n
      const earnings = total - invested
      setInvestmentResult({ total, invested, earnings })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calculadoras Financeiras</h1>
        <p className="text-gray-600 mt-2">Ferramentas para planejar suas finanças</p>
      </div>

      <Tabs defaultValue="compound" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compound" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Juros Compostos
          </TabsTrigger>
          <TabsTrigger value="loan" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Financiamento
          </TabsTrigger>
          <TabsTrigger value="investment" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Investimento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compound">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calculadora de Juros Compostos
                </CardTitle>
                <CardDescription>
                  Calcule o crescimento do seu investimento ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="principal">Valor Inicial (R$)</Label>
                  <Input
                    id="principal"
                    type="number"
                    step="0.01"
                    placeholder="10000"
                    value={compoundData.principal}
                    onChange={(e) => setCompoundData({...compoundData, principal: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rate">Taxa de Juros Anual (%)</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    placeholder="10"
                    value={compoundData.rate}
                    onChange={(e) => setCompoundData({...compoundData, rate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Período (anos)</Label>
                  <Input
                    id="time"
                    type="number"
                    placeholder="5"
                    value={compoundData.time}
                    onChange={(e) => setCompoundData({...compoundData, time: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Capitalização</Label>
                  <Select value={compoundData.compound} onValueChange={(value) => setCompoundData({...compoundData, compound: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Anual</SelectItem>
                      <SelectItem value="12">Mensal</SelectItem>
                      <SelectItem value="365">Diária</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculateCompoundInterest} className="w-full">
                  Calcular
                </Button>
              </CardContent>
            </Card>

            {compoundResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Resultado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Valor Final</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(compoundResult)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Valor Investido</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(parseFloat(compoundData.principal))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Juros Ganhos</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(compoundResult - parseFloat(compoundData.principal))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="loan">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Calculadora de Financiamento
                </CardTitle>
                <CardDescription>
                  Calcule as parcelas do seu financiamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loan-principal">Valor do Empréstimo (R$)</Label>
                  <Input
                    id="loan-principal"
                    type="number"
                    step="0.01"
                    placeholder="200000"
                    value={loanData.principal}
                    onChange={(e) => setLoanData({...loanData, principal: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loan-rate">Taxa de Juros Anual (%)</Label>
                  <Input
                    id="loan-rate"
                    type="number"
                    step="0.01"
                    placeholder="8.5"
                    value={loanData.rate}
                    onChange={(e) => setLoanData({...loanData, rate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loan-time">Período (anos)</Label>
                  <Input
                    id="loan-time"
                    type="number"
                    placeholder="30"
                    value={loanData.time}
                    onChange={(e) => setLoanData({...loanData, time: e.target.value})}
                  />
                </div>

                <Button onClick={calculateLoan} className="w-full">
                  Calcular
                </Button>
              </CardContent>
            </Card>

            {loanResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Resultado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Parcela Mensal</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatCurrency(loanResult.monthly)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Total a Pagar</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(loanResult.total)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total de Juros</p>
                      <p className="text-lg font-semibold text-red-600">
                        {formatCurrency(loanResult.total - parseFloat(loanData.principal))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="investment">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Calculadora de Investimento
                </CardTitle>
                <CardDescription>
                  Calcule o resultado de aportes mensais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="monthly">Aporte Mensal (R$)</Label>
                  <Input
                    id="monthly"
                    type="number"
                    step="0.01"
                    placeholder="500"
                    value={investmentData.monthly}
                    onChange={(e) => setInvestmentData({...investmentData, monthly: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inv-rate">Taxa de Retorno Anual (%)</Label>
                  <Input
                    id="inv-rate"
                    type="number"
                    step="0.01"
                    placeholder="12"
                    value={investmentData.rate}
                    onChange={(e) => setInvestmentData({...investmentData, rate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inv-time">Período (anos)</Label>
                  <Input
                    id="inv-time"
                    type="number"
                    placeholder="10"
                    value={investmentData.time}
                    onChange={(e) => setInvestmentData({...investmentData, time: e.target.value})}
                  />
                </div>

                <Button onClick={calculateInvestment} className="w-full">
                  Calcular
                </Button>
              </CardContent>
            </Card>

            {investmentResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Resultado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Valor Final</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(investmentResult.total)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Investido</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(investmentResult.invested)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rendimento</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(investmentResult.earnings)}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Multiplicador: {(investmentResult.total / investmentResult.invested).toFixed(2)}x
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
