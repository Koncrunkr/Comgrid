



export function getParam(name: string): string{
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(name)
}