import Vue from 'vue';

//创建公共bus对象
const bus = new Vue();

const DataList = 'DataList';

//导出

//默认导出，每个模块中，只能默认导出一个成员
// export default bus

//按需导出，可以导出多个成员，此刻‘{}’不再是一个对象，而是一个按需导出的标识
export {bus, DataList};