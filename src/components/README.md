# 组件架构指南

本指南介绍了项目中标准化的组件架构和最佳实践。

## 📋 目录结构

```
src/components/
├── ui/                     # 基础UI组件
│   ├── index.ts           # 统一导出
│   ├── button.tsx         # 基础组件
│   ├── input.tsx
│   ├── standard-form.tsx  # 标准化组件
│   ├── standard-list.tsx
│   └── ...
├── auth/                  # 认证相关组件
├── sections/              # 页面区块组件
├── organisms/             # 复合组件
└── providers/             # Context提供者
```

## 🏗️ 标准化Props接口

### 基础接口

所有组件都应该继承或使用这些标准化接口：

```typescript
// 基础组件Props
interface BaseComponentProps {
  className?: string
  children?: ReactNode
  'data-testid'?: string
}

// 加载状态
interface LoadingState {
  loading?: boolean
  disabled?: boolean
}

// 错误处理
interface ErrorState {
  error?: string | Error | null
  onErrorDismiss?: () => void
}

// 异步操作
interface AsyncState extends LoadingState, ErrorState {
  success?: boolean
  onRetry?: () => void
}
```

### 表单组件接口

```typescript
interface BaseFormProps<T = unknown> extends AsyncState {
  onSubmit?: StandardSubmitHandler<T>
  onReset?: () => void
  onCancel?: () => void
  submitText?: string
  resetText?: string
  cancelText?: string
  isSubmitting?: boolean
  defaultValues?: Partial<T>
}
```

### 列表组件接口

```typescript
interface BaseListProps<T> extends AsyncState {
  items?: T[]
  emptyStateText?: string
  emptyStateAction?: ReactNode
  onRefresh?: () => void
  keyExtractor?: (item: T, index: number) => string
}
```

## 🔧 标准化组件

### StandardForm

统一的表单组件，提供一致的：

- 错误处理和显示
- 加载状态管理
- 操作按钮布局
- 验证消息显示

```tsx
<StandardForm<LoginFormData>
  variant='card'
  title='用户登录'
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  loading={isLoading}
  error={formError}
  submitText='登录'
>
  <Input {...register('email')} />
  <Input {...register('password')} />
</StandardForm>
```

### StandardList

统一的列表组件，提供：

- 分页控制
- 加载和错误状态
- 空状态处理
- 选择功能

```tsx
<StandardList<API>
  items={apis}
  loading={loading}
  error={error}
  renderItem={(api) => <APICard api={api} />}
  showPagination={true}
  page={currentPage}
  onPageChange={setCurrentPage}
/>
```

### StandardModal

统一的模态框组件，提供：

- 生命周期管理
- 键盘交互
- 确认/取消操作
- 错误状态显示

```tsx
<StandardModal
  open={showDialog}
  onOpenChange={setShowDialog}
  title='确认删除'
  variant='destructive'
  onConfirm={handleDelete}
  confirmText='删除'
>
  <p>确定要删除这个API吗？</p>
</StandardModal>
```

## 🎨 组件设计原则

### 1. 单一职责原则

每个组件只负责一个功能领域：

```tsx
// ✅ 好的设计
<LoginForm onSuccess={handleSuccess} />
<UserProfile user={user} />

// ❌ 避免
<AuthAndProfileComponent />
```

### 2. 组合优于继承

使用组合模式构建复杂组件：

```tsx
// ✅ 组合模式
<StandardModal>
  <UserForm onSubmit={handleSubmit} />
</StandardModal>

// ❌ 继承模式
<UserFormModal extends Modal>
```

### 3. 一致的Props命名

使用标准化的Props命名：

```tsx
// ✅ 一致的命名
interface ComponentProps {
  loading?: boolean // 不是 isLoading, loading
  disabled?: boolean // 不是 isDisabled, disabled
  onSubmit?: () => void // 不是 handleSubmit, submit
  error?: string | null // 不是 errorMessage, err
}
```

### 4. 可访问性优先

所有组件都应支持无障碍访问：

```tsx
<Button aria-label={t('auth.login')} data-testid='login-button' disabled={loading}>
  {loading ? <Spinner /> : t('auth.login')}
</Button>
```

## 📝 使用指南

### 创建新组件

1. **确定组件类型**：基础UI组件还是业务组件？
2. **选择基础接口**：继承合适的标准化Props接口
3. **实现组件逻辑**：遵循组件设计原则
4. **添加类型定义**：完善TypeScript类型
5. **编写测试**：确保组件功能正确

### 重构现有组件

1. **分析现有Props**：识别可以标准化的部分
2. **逐步迁移**：保持向后兼容性
3. **更新调用代码**：使用新的标准化接口
4. **清理冗余代码**：移除重复的逻辑

### 组件测试

使用标准化的测试模式：

```tsx
describe('LoginForm', () => {
  it('should submit form data', async () => {
    const onSubmit = jest.fn()
    render(<LoginForm onSubmit={onSubmit} data-testid='login-form' />)

    // 填写表单
    await userEvent.type(screen.getByTestId('login-form-email'), 'test@example.com')
    await userEvent.type(screen.getByTestId('login-form-password'), 'password123')

    // 提交表单
    await userEvent.click(screen.getByTestId('login-form-submit'))

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })
})
```

## 🚀 性能优化

### 1. 组件懒加载

```tsx
const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Skeleton />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### 2. memo优化

```tsx
const ExpensiveComponent = memo(({ data, onUpdate }) => {
  return <div>{/* 复杂渲染逻辑 */}</div>
})
```

### 3. 事件处理器稳定化

```tsx
const handleClick = useCallback(
  (id: string) => {
    onItemClick(id)
  },
  [onItemClick]
)
```

## 🔍 调试和开发工具

### 1. 开发模式检查

```tsx
if (process.env.NODE_ENV === 'development') {
  // 开发模式下的额外检查和警告
  console.warn('Component props validation failed')
}
```

### 2. Error Boundary集成

```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <UserComponent />
</ErrorBoundary>
```

## 📚 进一步学习

- [React组件设计模式](https://react.dev/learn)
- [TypeScript接口设计](https://www.typescriptlang.org/docs/)
- [无障碍Web开发](https://web.dev/accessibility/)
- [组件测试最佳实践](https://testing-library.com/docs/)
