import { useState, useRef } from 'react'

export function useRefState<T>(initialValue: T): [React.MutableRefObject<T>, (newValue: T) => void] {
    const [state, setState] = useState<T>(initialValue)
    const stateRef = useRef<T>(state)

    const setRefState = (newValue: T) => {
        stateRef.current = newValue
        setState(newValue)
    }

    return [stateRef, setRefState]
}
