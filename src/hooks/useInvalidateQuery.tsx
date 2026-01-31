import { useQueryClient } from '@tanstack/react-query'

export const useInvalidateQuery = () =>{
    const qc = useQueryClient()

    const invalidateKey = (key: string) => {
        qc.invalidateQueries({ queryKey: [key]})
    }

    return { invalidateKey }
}