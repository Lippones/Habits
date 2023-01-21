interface Props {
    day: String
}

export function WeekDay(props: Props) {
    return (
        <div className="text-zinc-400 text-xl font-bold h-10 w-10 flex items-center justify-center">
            {props.day}
        </div>
    )
}