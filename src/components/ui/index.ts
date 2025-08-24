/**
 * UI组件导出索引
 * 统一导出所有UI组件，便于使用和维护
 */

// 基础UI组件
export { Alert, AlertTitle, AlertDescription } from './alert'
export { Avatar, AvatarFallback, AvatarImage } from './avatar'
export { Badge, badgeVariants } from './badge'
export { Button, buttonVariants } from './button'
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from './dialog'
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu'
export { Input } from './input'
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select'
export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination'
export { Skeleton } from './skeleton'
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
export { Toggle, type ToggleProps } from './toggle'

// 项目特定UI组件
export { APICardSkeletonGrid } from './api-card-skeleton'
export { AuroraBackground } from './aurora-background'
export { CachedAvatar } from './cached-avatar'
export { FloatingUFO } from './floating-ufo'
export { Footer } from './footer'
export { LanguageSelector } from './language-selector'
export { Loading, PageLoading, InlineLoading } from './loading'
export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from './navigation-menu'
export { ThemeToggle, ThemeToggleWithLabel } from './theme-toggle'
export { useToast, toast } from './toast'

// 标准化组件
export { default as AuthRequired } from './auth-required'
export { StandardForm, type StandardFormProps } from './standard-form'
export { StandardList, type StandardListProps } from './standard-list'
export { StandardModal, ConfirmDialog, type StandardModalProps } from './standard-modal'
export { StandardTagInput, type StandardTagInputProps } from './standard-tag-input'
