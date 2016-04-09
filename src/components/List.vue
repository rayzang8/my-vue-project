<template>
    <a class="imc"
       v-link="{ path: '/list',name:'date',params:{dateStr:date,genderStr:gender} }"
       v-bind:id="gender+'_'+item.dateTime">
        <img v-bind:src="item.content[0]">

        <div class="desc">{{item.title}}</div>
    </a>
</template>

<script>
    export default {
        props: ['item', 'date', 'gender']
    }
</script>