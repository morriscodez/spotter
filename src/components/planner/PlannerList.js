import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router"
import { PlannerContext } from "./PlannerProvider"
import Button from "react-bootstrap/Button"
import { PlannerCard } from "./PlannerCard"
import { WorkoutContext } from "../workouts/WorkoutProvider"
import { DayContext } from "../days/DayProvider"

export const PlannerList = () => {

    // history & userID
    const history = useHistory()
    const currentUserId = sessionStorage.getItem("app_user_id")

    // context for planners & workouts & days
    const { planners, getPlanners } = useContext(PlannerContext)
    const { workouts, getWorkoutsByUserId} = useContext(WorkoutContext)
    const { days, getDays} = useContext(DayContext)

    // current user planners state variable
    const [filteredPlanners, setFilteredPlanners] = useState([])

    //current day state variable
    const [currentDay, setCurrentDay] = useState(8)

    //day name state variable
    const [plannerDay, setPlannerDay] = useState("")

    //scheduled workout state variable
    const [scheduledWorkouts, setScheduledWorkouts] = useState()
    
    // fetch data on page load
    useEffect(() => {
        getPlanners()
            .then(getWorkoutsByUserId(currentUserId))
        
    }, [])

    // filter planners => set state for current user
    useEffect(() => {
        const matchingPlanners = [] 
        
        workouts.map(workout => {
            
            planners.filter(planner => {
                if (planner.workoutId === workout.id) {
                    matchingPlanners.push(planner)
                }
            })
        }) 

        setFilteredPlanners(matchingPlanners)
    }, [workouts, planners])

    //get current day on render
    useEffect(() => {
        let today = new Date().getDay()
        today++
        setCurrentDay(today)
    }, [])

    // //get days on render
    // useEffect(() => {
    //     getDays()
    // }, [])

    // //find matching day from database
    // useEffect(() => {
    //     const matchingDay = days.find(day => day?.id === (currentDay + 1))
    //     setPlannerDay(matchingDay)
    // }, [currentDay])

    useEffect(() => {
        console.log("filtered", filteredPlanners)
        const dailyWorkout = filteredPlanners.filter(item => item.day?.id === currentDay)
        console.log('dailyWorkout: ', dailyWorkout);


    }, [filteredPlanners])


    return (
        <>
            <Button onClick={() => history.push(`/planner/create`)}>
                Plan New Workout
            </Button>

            <div className="planners--list">
                {filteredPlanners.length === 0 ? "Plan your workouts!" : filteredPlanners.map(planner => {
                    return <PlannerCard key={planner.id} planner={planner}/>
                })}
            </div>

        </>
    )
}