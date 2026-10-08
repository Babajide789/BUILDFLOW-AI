"use client"

import { useState, type ReactNode } from "react"

import {
  Calculator,
  CheckCircle2,
  ClipboardList,
  Layers3,
  XCircle,
  ChevronDown,
} from "lucide-react"

import { BoqCreateForm } from "@/components/dashboard/boq-create-form"
import {
  BoqItemCreateForm,
  BoqItemEditForm,
  BoqItemRowActions,
} from "@/components/dashboard/boq-item-actions"
import {
  BoqSectionActions,
  BoqSectionDeleteButton,
  BoqSectionEdit,
} from "@/components/dashboard/boq-section-actions"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type {
  Boq,
  BoqItem,
  BoqSection,
} from "@/lib/types/boq"

interface BoqWorkspaceProps {
  boq: Boq | null
  projectId: string
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(value)
}

function formatNumber(
  value: number,
  maximumFractionDigits = 2
) {
  return new Intl.NumberFormat("en-NG", {
    maximumFractionDigits,
  }).format(value)
}

function getUnitLabel(unit: BoqItem["unit"]) {
  const labels: Record<BoqItem["unit"], string> = {
    item: "Item",
    m: "m",
    m2: "m²",
    m3: "m³",
    kg: "kg",
    tonne: "tonne",
    litre: "litre",
    day: "day",
    hour: "hour",
    ls: "L/S",
  }

  return labels[unit]
}

function getStatusLabel(
  status: BoqItem["status"]
) {
  const labels: Record<
    BoqItem["status"],
    string
  > = {
    active: "Active",
    completed: "Completed",
    cancelled: "Cancelled",
  }

  return labels[status]
}

function getSectionTotal(section: BoqSection) {
  return section.items.reduce(
    (total, item) => total + item.amount,
    0
  )
}

function getItemCount(boq: Boq) {
  return boq.sections.reduce(
    (total, section) =>
      total + section.items.length,
    0
  )
}

export function BoqWorkspace({
  boq,
  projectId,
}: BoqWorkspaceProps) {
  if (!boq) {
    return <BoqCreateForm projectId={projectId} />
  }

  const itemCount = getItemCount(boq)
  const summary = boq.commercialSummary

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ClipboardList
                    className="size-5"
                    aria-hidden="true"
                  />
                </div>

                <Badge variant="outline">
                  Bill of Quantities
                </Badge>
              </div>

              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {boq.name}
                </h2>

                {boq.description ? (
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    {boq.description}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl border bg-muted/30 px-5 py-4 lg:min-w-64">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Total BOQ value
              </p>

              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {formatCurrency(
                  summary.totalAmount
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={
            <Calculator className="size-5 text-muted-foreground" />
          }
          label="Total value"
          value={formatCurrency(
            summary.totalAmount
          )}
        />

        <SummaryCard
          icon={
            <CheckCircle2 className="size-5 text-muted-foreground" />
          }
          label="Completed value"
          value={formatCurrency(
            summary.completedAmount
          )}
          detail={`${formatNumber(
            summary.completedPercentage,
            1
          )}% of BOQ`}
        />

        <SummaryCard
          icon={
            <Layers3 className="size-5 text-muted-foreground" />
          }
          label="Active value"
          value={formatCurrency(
            summary.activeAmount
          )}
          detail={`${formatNumber(
            summary.activePercentage,
            1
          )}% of BOQ`}
        />

        <SummaryCard
          icon={
            <XCircle className="size-5 text-muted-foreground" />
          }
          label="Cancelled value"
          value={formatCurrency(
            summary.cancelledAmount
          )}
          detail={`${formatNumber(
            summary.cancelledPercentage,
            1
          )}% of BOQ`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add section</CardTitle>
        </CardHeader>

        <CardContent>
          <BoqSectionActions
            boqId={boq.id}
            projectId={projectId}
          />
        </CardContent>
      </Card>

      <div className="space-y-6">
        {boq.sections.map((section) => (
          <BoqSectionCard
            key={section.id}
            section={section}
            projectId={projectId}
          />
        ))}
      </div>

      <Card className="border-primary/20">
        <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Bill of Quantities
            </p>

            <p className="text-sm text-muted-foreground">
              {boq.sections.length} sections ·{" "}
              {itemCount} line items
            </p>
          </div>

          <p className="text-2xl font-semibold tracking-tight">
            {formatCurrency(
              summary.totalAmount
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode
  label: string
  value: string
  detail?: string
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>

          <p className="mt-1 truncate text-lg font-semibold">
            {value}
          </p>

          {detail ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {detail}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

function BoqSectionCard({
  section,
  projectId,
}: {
  section: BoqSection
  projectId: string
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const sectionTotal = getSectionTotal(section)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/20">
        {isEditing ? (
          <BoqSectionEdit
            sectionId={section.id}
            projectId={projectId}
            name={section.name}
            description={section.description}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              className="flex min-w-0 flex-1 items-start gap-3 text-left"
              aria-expanded={isOpen}
            >
              <ChevronDown
                className={`mt-0.5 size-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <CardTitle className="text-lg">{section.name}</CardTitle>
                {section.description ? (
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {section.description}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-muted-foreground">
                  {section.items.length} {section.items.length === 1 ? "line item" : "line items"}
                </p>
              </div>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <div className="shrink-0 sm:text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Section total
                </p>
                <p className="mt-1 font-semibold">{formatCurrency(sectionTotal)}</p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex h-9 items-center justify-center rounded-md border bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Edit
              </button>

              <BoqSectionDeleteButton
                sectionId={section.id}
                projectId={projectId}
              />
            </div>
          </div>
        )}
      </CardHeader>

      {isOpen ? (
        <CardContent className="p-0">
          {section.items.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              No line items in this section yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-245 text-sm">
                <thead className="bg-muted/30">
                  <tr className="border-b">
                    <th className="w-28 px-4 py-3 text-left font-medium text-muted-foreground sm:px-6">Item code</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
                    <th className="w-24 px-4 py-3 text-right font-medium text-muted-foreground">Unit</th>
                    <th className="w-32 px-4 py-3 text-right font-medium text-muted-foreground">Quantity</th>
                    <th className="w-40 px-4 py-3 text-right font-medium text-muted-foreground">Rate</th>
                    <th className="w-44 px-4 py-3 text-right font-medium text-muted-foreground">Amount</th>
                    <th className="w-24 px-4 py-3 text-right font-medium text-muted-foreground sm:px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item) => (
                    <BoqItemRow key={item.id} item={item} projectId={projectId} />
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/20">
                    <td colSpan={6} className="px-4 py-4 text-right font-medium sm:px-6">Section subtotal</td>
                    <td className="px-4 py-4 text-right font-semibold tabular-nums sm:px-6">{formatCurrency(sectionTotal)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          <BoqItemCreateForm sectionId={section.id} projectId={projectId} />
        </CardContent>
      ) : null}
    </Card>
  )
}

function BoqItemRow({
  item,
  projectId,
}: {
  item: BoqItem
  projectId: string
}) {
  const [isEditing, setIsEditing] =
    useState(false)

  if (isEditing) {
    return (
      <tr>
        <td colSpan={7} className="p-0">
          <BoqItemEditForm
            item={item}
            projectId={projectId}
            onCancel={() =>
              setIsEditing(false)
            }
          />
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-b last:border-b-0">
      <td className="px-4 py-4 font-medium sm:px-6">
        {item.itemCode}
      </td>

      <td className="px-4 py-4">
        <div className="space-y-1">
          <p>{item.description}</p>

          {item.status !== "active" ? (
            <Badge
              variant={
                item.status === "completed"
                  ? "secondary"
                  : "destructive"
              }
            >
              {getStatusLabel(item.status)}
            </Badge>
          ) : null}
        </div>
      </td>

      <td className="px-4 py-4 text-right text-muted-foreground">
        {getUnitLabel(item.unit)}
      </td>

      <td className="px-4 py-4 text-right tabular-nums">
        {formatNumber(item.quantity, 4)}
      </td>

      <td className="px-4 py-4 text-right tabular-nums">
        {formatCurrency(item.rate)}
      </td>

      <td className="px-4 py-4 text-right font-medium tabular-nums">
        {formatCurrency(item.amount)}
      </td>

      <td className="px-4 py-4 text-right sm:px-6">
        <BoqItemRowActions
          item={item}
          projectId={projectId}
          onEdit={() =>
            setIsEditing(true)
          }
        />
      </td>
    </tr>
  )
}