<script context='module'>
    
</script>
<script>
    import { browser } from "$app/env";
    import { goto } from "$app/navigation";

    import { userInfo, statisticsSendRequest } from "../store";

    import { getStatistics } from "../actions/logsActions";
    import CustomContainer from "../components/CustomContainer.svelte";
    import Message from "../components/Message.svelte";
    import Loading from "../components/Loading.svelte";
    import Chart from "chart.js/auto";
    import { onMount } from "svelte";

    $: {
        let isAuthenticate = $userInfo && $userInfo.profil === 'admin' ? true : false;
        if (browser && !isAuthenticate) { goto('/'); }
    }
    
    let type = '';
    let target = '';
    let startDate = (new Date(Date.now())).toISOString().substring(0,10);
    let endDate = (new Date(Date.now())).toISOString().substring(0,10);
    let ctx = null;
    let statisticsChart;
    

    onMount(() => {
        ctx = document.getElementById('statisticsChart').getContext('2d');
        statisticsChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: '# of Views',
                        data: [],
                        backgroundColor: [],
                        borderColor: [],
                        borderWidth: 1,
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        },
                    }
                }
            });
    });

    $:{
        if ($statisticsSendRequest.statistics && $statisticsSendRequest.statistics.statistics.length) {
            statisticsChart.data.labels = [];
            statisticsChart.data.datasets.forEach( (dataset) => dataset.data=[] );
            statisticsChart.data.datasets.forEach( (dataset) => dataset.borderColor=[] );
            for (let incr = 0; incr < $statisticsSendRequest.statistics.statistics.length; incr++) {
                const value = $statisticsSendRequest.statistics.statistics[incr];
                statisticsChart.data.labels.push(value.date.substring(0,10));
                statisticsChart.data.datasets.forEach((dataset) => dataset.data.push(Number(value.value)));
                statisticsChart.data.datasets.forEach((dataset) => dataset.borderColor.push('#2c3f78'));
            }
            statisticsChart.update();
        }
    }

    const submitHandler = (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
        } else {
            e.preventDefault(); // to avoid page to refresh
            getStatistics(type, target, startDate, endDate);
        }
    };

</script>

<CustomContainer>
    <h1 class='mt-2'>Statistics</h1>

    <form id='statistics' class="row statistics-form" on:submit={submitHandler}>
            
        <div class="row align-items-center mb-3">

            <div class="col-sm-12 col-md-6">
                <label for="startDateInput" class="form-label">Date de début</label>
                <input type="date" class="form-control" id="startDateInput" required bind:value={startDate}>
            </div>
            <div class="col-sm-12 col-md-6">
                <label for="endDateInput" class="form-label">Date de fin</label>
                <input type="date" class="form-control" id="endDateInput" required bind:value={endDate}>
            </div>
        </div>
        
        <div class='row'>
            <div class='col text-start'>
                <button type="submit" class="btn btn-primary">Valider</button>
            </div>
        </div>
    </form>

    {#if $statisticsSendRequest.loading}
        <Loading number={3} color="primary" />
    {/if}
    {#if $statisticsSendRequest.message}
        <Message color={$statisticsSendRequest.success ? "primary" : "danger"}>{$statisticsSendRequest.message}</Message>
    {/if}
    <div class='row my-3'>
        <div class='col bg-light rounded p-5'>
            <canvas id="statisticsChart"></canvas>
        </div>
    </div>

</CustomContainer>