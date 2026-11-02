export default function SpaLink({ href, navigate, onClick, children, ...props }) {
  function handleClick(event) {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target ||
      props.download ||
      !href.startsWith('/')
    ) {
      return
    }

    event.preventDefault()
    navigate(href)
  }

  return <a href={href} onClick={handleClick} {...props}>{children}</a>
}
