<script>
    import { Alert } from "sveltestrap";

    export let color = 'primary';

</script>

<Alert color={color} class='my-3'><slot></slot></Alert>

