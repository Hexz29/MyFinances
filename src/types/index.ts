export interface User {
  id: string
  email: string
  created_at: string
}

export interface Account {
  id: string
  user_id: string
  name: string
  type: 'checking' | 'savings' | 'investment' | 'credit'
  balance: number
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  account_id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string
  date: string
  created_at: string
}

export interface Budget {
  id: string
  user_id: string
  category: string
  amount: number
  spent: number
  month: number
  year: number
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  target_date: string
  created_at: string
  updated_at: string
}

export interface Investment {
  id: string
  user_id: string
  name: string
  type: 'stocks' | 'bonds' | 'funds' | 'crypto'
  amount: number
  current_value: number
  purchase_date: string
  created_at: string
  updated_at: string
}