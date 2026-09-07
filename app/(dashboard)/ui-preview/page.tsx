"use client"

import {
  Check,
  ChevronDown,
  Info,
  MoreHorizontal,
  Settings,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PageHeader } from "@/components/dashboard/page-header"
import { PageSection } from "@/components/dashboard/page-section"

export default function UIPlaygroundPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-4 md:p-6 lg:p-8">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Shared UI Playground
          </h1>

          <Badge variant="secondary">BF-105</Badge>
        </div>

        <p className="max-w-2xl text-sm text-muted-foreground">
          Internal QA surface for validating the BuildFlow shared UI
          foundation across interaction, keyboard, responsive, and theme
          states.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Alert */}
        <Card>
          <CardHeader>
            <CardTitle>Alert</CardTitle>
            <CardDescription>
              Test status messaging, destructive feedback, semantic
              accessibility, and theme behavior.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert>
              <AlertTitle>Project created</AlertTitle>

              <AlertDescription>
                Your project has been successfully created and is ready
                for configuration.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertTitle>Something went wrong</AlertTitle>

              <AlertDescription>
                We couldn&apos;t save your project changes. Please try again.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>Skeleton</CardTitle>
            <CardDescription>
              Test loading placeholders across common content shapes and
              responsive layouts.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full max-w-md" />
              <Skeleton className="h-4 w-3/4 max-w-sm" />
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>
              Test completion states, value handling, accessibility, and
              responsive behavior.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Project completion</span>
                <span className="text-muted-foreground">25%</span>
              </div>

              <Progress value={25} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Document processing</span>
                <span className="text-muted-foreground">65%</span>
              </div>

              <Progress value={65} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Project setup</span>
                <span className="text-muted-foreground">100%</span>
              </div>

              <Progress value={100} />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Table</CardTitle>
            <CardDescription>
              Test table structure, responsive overflow, row states, and
              shared data presentation.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableCaption>
                Recent BuildFlow project activity.
              </TableCaption>

              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    Victoria Island Residence
                  </TableCell>
                  <TableCell>Adebayo Construction</TableCell>
                  <TableCell>
                    <Badge>Active</Badge>
                  </TableCell>
                  <TableCell>65%</TableCell>
                  <TableCell className="text-right">
                    ₦25,000,000
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">
                    Lekki Commercial Centre
                  </TableCell>
                  <TableCell>BuildCorp Nigeria</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Planning</Badge>
                  </TableCell>
                  <TableCell>25%</TableCell>
                  <TableCell className="text-right">
                    ₦42,500,000
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">
                    Ikeja Office Complex
                  </TableCell>
                  <TableCell>Prime Developments</TableCell>
                  <TableCell>
                    <Badge variant="outline">Completed</Badge>
                  </TableCell>
                  <TableCell>100%</TableCell>
                  <TableCell className="text-right">
                    ₦18,750,000
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Dialog */}
        <Card>
          <CardHeader>
            <CardTitle>Dialog</CardTitle>
            <CardDescription>
              Test modal opening, closing, focus handling, and backdrop
              dismissal.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Dialog>
              <DialogTrigger render={<Button />}>
                Open Dialog
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Project settings</DialogTitle>

                  <DialogDescription>
                    This is a shared BuildFlow dialog component. Verify that
                    the modal opens correctly and focus remains inside it.
                  </DialogDescription>
                </DialogHeader>

                <div className="rounded-lg border bg-muted/50 p-4 text-sm">
                  Dialog content is rendered through the shared UI layer.
                </div>

                <DialogFooter showCloseButton />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Dropdown */}
        <Card>
          <CardHeader>
            <CardTitle>Dropdown Menu</CardTitle>
            <CardDescription>
              Test menu positioning, keyboard navigation, and dismissal.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                Actions
                <ChevronDown />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Project</DropdownMenuLabel>

                  <DropdownMenuItem>
                    <Settings />
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Info />
                    Details
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem>
                    <Check />
                    Mark complete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* Select */}
        <Card>
          <CardHeader>
            <CardTitle>Select</CardTitle>
            <CardDescription>
              Test selection, keyboard navigation, focus, and responsive
              positioning.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Select defaultValue="active">
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select project status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Popover */}
        <Card>
          <CardHeader>
            <CardTitle>Popover</CardTitle>
            <CardDescription>
              Test anchored positioning, opening, closing, and content
              alignment.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Popover>
              <PopoverTrigger render={<Button variant="outline" />}>
                Project info
              </PopoverTrigger>

              <PopoverContent className="w-80">
                <PopoverHeader>
                  <PopoverTitle>BuildFlow Project</PopoverTitle>

                  <PopoverDescription>
                    Quick project information displayed inside a shared
                    popover.
                  </PopoverDescription>
                </PopoverHeader>

                <div className="mt-4 rounded-md border p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge>Active</Badge>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        {/* Tooltip */}
        <Card>
          <CardHeader>
            <CardTitle>Tooltip</CardTitle>
            <CardDescription>
              Test hover, focus, and keyboard accessibility.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" size="icon" />}>
                <MoreHorizontal />
                <span className="sr-only">More information</span>
              </TooltipTrigger>

              <TooltipContent>
                Additional project actions
              </TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>

        {/* Combined interaction */}
        <Card>
          <CardHeader>
            <CardTitle>Combined Components</CardTitle>
            <CardDescription>
              Quick sanity check for multiple shared primitives working
              together.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-3">
            <Button>Primary</Button>

            <Button variant="outline">Outline</Button>

            <Button variant="secondary">Secondary</Button>

            <Button variant="ghost">Ghost</Button>

            <Badge>Active</Badge>

            <Badge variant="outline">Draft</Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>PageHeader</CardTitle>
            <CardDescription>
              Page-level heading composition with optional description and actions.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <PageHeader
              title="Project Overview"
              description="Review project status, budget, and recent activity."
              actions={
                <>
                  <Button variant="outline">Export</Button>
                  <Button>New Report</Button>
                </>
              }
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
  <CardHeader>
    <CardTitle>PageSection</CardTitle>
    <CardDescription>
      Shared page-level content grouping with optional heading,
      description, and actions.
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-8">
    <PageSection
      title="Active Projects"
      description="Projects currently in progress."
      actions={
        <Button variant="outline">
          View All
        </Button>
      }
    >
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        Project content placeholder
      </div>
    </PageSection>

    <PageSection title="Recent Activity">
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        Activity content placeholder
      </div>
    </PageSection>

    <PageSection>
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        Content-only section
      </div>
    </PageSection>
  </CardContent>
</Card>
      </div>
    </main>
  )
}