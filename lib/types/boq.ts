export type BoqUnit =
  | "item"
  | "m"
  | "m2"
  | "m3"
  | "kg"
  | "tonne"
  | "litre"
  | "day"
  | "hour"
  | "ls"

export type BoqItemStatus =
  | "active"
  | "completed"
  | "cancelled"

export interface BoqItem {
  id: string
  sectionId: string
  itemCode: string
  description: string
  unit: BoqUnit
  quantity: number
  rate: number
  amount: number
  status: BoqItemStatus
  sortOrder: number
}

export interface BoqSection {
  id: string
  boqId: string
  name: string
  description: string
  sortOrder: number
  items: BoqItem[]
}

export interface Boq {
  id: string
  projectId: string
  name: string
  description: string
  sections: BoqSection[]
  totalAmount: number
}