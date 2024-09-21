// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    }
  ]
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  }
];

// function getLearnerData(course, ag, submissions) {
//   // here, we would process this data to achieve the desired result.
//   const result = [
//     {
//       id: 125,
//       avg: 0.985, // (47 + 150) / (50 + 150)
//       1: 0.94, // 47 / 50
//       2: 1.0 // 150 / 150
//     },
//     {
//       id: 132,
//       avg: 0.82, // (39 + 125) / (50 + 150)
//       1: 0.78, // 39 / 50
//       2: 0.833 // late: (140 - 15) / 150
//     }
//   ];

//   return result;

// }

// function to calculate percentage
function calculatePercentage(score, points_possible){
  if (points_possible === 0) {
    throw new Error('Maximum points cannot be 0');
  }
  return score / points_possible;
}

function validateAssignmentGroup(group, CourseInfo){
  if (group.course_id !== CourseInfo.id){
    throw new Error(`Assignment Group ${group.id} does not belong to course ${CourseInfo.id}`)
  };
  console.log(`Assignment Group ${group.id} is valid for course ${CourseInfo.id}`);
}
try {
  validateAssignmentGroup(AssignmentGroup, CourseInfo);
} catch (error) {
  console.error(error.message);
}

function isLate(submitted_at, due_at){
  const submittedDate = new Date(submitted_at);
  const dueDate = new Date(due_at);
  return submittedDate > dueDate;
}

function processLearnerSubmissions(LearnerSubmissions, AssignmentGroup, CourseInfo){
  const results = {};
  LearnerSubmissions.forEach(submission => {
    const assignment = AssignmentGroup.assignments.find(a => a.id === submission.assignment_id);
    if (!assignment){
      console.warn(`Assignment ID ${submission.assignment_id} not found.`);
      return; // skip if assignment doesn't exist
    }
    // Check if the assignment is late
    const latePenalty = isLate(submission.submission.submitted_at, assignment.due_at) ? 0.1 : 0;
    const maxPoints = latePenalty > 0 ? assignment.points_possible * (1 - latePenalty) : assignment.points_possible;
    const percentage = calculatePercentage(submission.submission.score, maxPoints);

    if(!results[submission.learner_id]) {
      results[submission.learner_id] = {
        id: submission.learner_id,
        avg: 0,
        scores: {},
        totalPoints:0,
        totalMaxPoints: 0
      };
    }
    // store the score for this assignment 
    results[submission.learner_id].scores[assignment.id]  = percentage;

    //update totals for average calculation
    results[submission.learner_id].totalPoints += submission.submission.score;
    results[submission.learner_id].totalMaxPoints += maxPoints;

  });
  // calculate the average score for each learner
  for(const learner_id in results) {
    const learnerData = results[learner_id];
    learnerData.avg = learnerData.totalMaxPoints ? learnerData.totalPoints / learnerData.totalMaxPoints : 0;

  }
  return Object.values(results);
}
const results = processLearnerSubmissions(LearnerSubmissions, AssignmentGroup, CourseInfo);
console.log("Learner Results:", results);

//main function to get learner data
function getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions){
//validate the assignment group 
validateAssignmentGroup(AssignmentGroup, CourseInfo);

//process learner submissions
const results = processLearnerSubmissions(LearnerSubmissions, AssignmentGroup, CourseInfo);
return results;
}
