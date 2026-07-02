/* Manejar consultas al servidor 
Toda consulta al servidor tiene 3 consultas posibles: pendientes(en proceso), resuelto, rechazado
*/
import { useState } from "react"

function useRequest() {
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState(null)
    const [error, setError] = useState(null)
    /** 
     * requestCallbackFn es el parametro de la funcion que hace la llamada al servidor
    */
    async function sendRequest(requestCallbackFn) {
        try {
            setLoading(true)
            //limpiamos errores previos
            setError(null)
            const server_response = await requestCallbackFn()
            setResponse(server_response)
        }
        catch (error) {
            setError(error.message)
        }
        finally{
            setLoading(false)
        }
    }

    return {
        sendRequest,
        loading,
        response,
        error
    }
}

export default useRequest