import axios, { AxiosError } from 'axios'

export type DataObjectError = {
    message: string
    timestamp: string
    code: number
    details?: Record<string, string>
}

/**
 * Extracts the message from an API response following the DataObjectError contract.
 * @param error Error thrown by the API (usually AxiosError)
 * @param fallback Default message if the error doesn't contain a specific message
 * @returns {string} The error message mapped from the backend or the fallback
 */
export function getErrorMessage(error: unknown, fallback = 'Ocorreu um erro inesperado'): string {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<DataObjectError>
        if (axiosError.response?.data?.message) {
            return axiosError.response.data.message
        }
    }

    if (error instanceof Error && error.message) {
        // Avoid returning weird network error strings directly if possible, but fallback to it if needed
        if (error.message !== 'Network Error') {
            return error.message
        }
    }

    return fallback
}
