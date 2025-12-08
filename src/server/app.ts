import { startApp } from 'modelence/server';
import exampleModule from '@/server/example';

startApp({
    modules: [exampleModule /* Add your modules here */]
});
