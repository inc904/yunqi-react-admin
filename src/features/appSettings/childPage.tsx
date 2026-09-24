import useTheme from '@/theme/useTheme'

export default function ChildPage() {
  const { theme, preference } = useTheme()
  return (
    <div className="child-page">
      <h2>Child Page</h2>
      <p>This is a child page under the App Settings section.</p>
      <div>theme: {theme}</div>
      <div>preference: {preference}</div>
    </div>
  )
}
