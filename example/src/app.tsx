
import { RouteSectionProps } from '@solidjs/router'
import { children, Component } from 'solid-js'

export const AppRoot: Component<RouteSectionProps> = (props) => <div>
    {children(() => props.children)()}
</div>