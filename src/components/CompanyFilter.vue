<template>
    <div class="input-group mt-5 mb-5">
        <input size="sm" 
            v-model="company"
            placeholder="Filter by company name ..." />
    </div>
</template>

<script>
export default {
    name: 'CompanyFilter',
    data () {
        return {
            company: ''
        }
    },
    methods: {
        
    },
    watch: {
        company(val) {
            this.$emit('setCompanyName', 
                {
                    filter: val
                }
            )
        }
    }
}
</script>

<style scoped>
.input-group input {
    border-radius: 5px;
    border: 1px solid;
    padding: 5px 10px;
    width: 300px;
    background-color: white;
    color: rgb(78, 112, 145);
    font-weight: normal;
}
.input-group input:focus, .input-group input:active {
    border: 1px solid #4e7091;
}
</style>