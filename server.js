var express = require('express');
var gqlHttp = require('express-graphql');
var {buildSchema} = require('graphql');

var schema = buildSchema(`
    type Query {
        course (id: Int!): Course
        courses (topic: String): [Course]
    },
    type Mutation {
        updateCourse (id: Int!, topic: String!): Course
    },
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`)

var coursesData = require('./courseData');

var getCourse = (args) => { 
    var id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}
var getCourses = (args) => {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

var updateCourse = ({id, topic}) => {
    coursesData.map(course => {
        if(course.id === id) {
            course.topic = topic
            return course;
        }
    })
    return coursesData.filter(course => course.id === id) [0];
}

var root = {
    course: getCourse,
    courses: getCourses,
    updateCourse: updateCourse
}

var app = express();

app.use('/', gqlHttp({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(3000, () => {
    console.log('magic happens on port: 3000');
})