type TFetchData<T> = {
  data?: T
  errMessage?: Error
  isLoading: boolean
  isSucces?: boolean
  isError?: boolean
}

export async function getFetch<T>(
  endpoint: string,
  delay: number = 1500,
): Promise<TFetchData<T>> {
  const result: TFetchData<T> = { isLoading: true }
  try {
    const res = await fetch(endpoint)
    await new Promise((res) => setTimeout(res, delay))
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
    }
    result.data = await res.json()
    result.isSucces = true
  } catch (err) {
    result.isError = true
    if (err instanceof Error) result.errMessage = err
  } finally {
    result.isLoading = false
  }

  return result
}
