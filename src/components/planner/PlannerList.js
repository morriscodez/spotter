import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router"
import { PlannerContext } from "./PlannerProvider"
import Button from "react-bootstrap/Button"
import { PlannerCard } from "./PlannerCard"
import { WorkoutContext } from "../workouts/WorkoutProvider"

export const PlannerList = () => {

    // history & userID
    const history = useHistory()
    const currentUserId = sessionStorage.getItem("app_user_id")

    // context for planners & workouts
    const { planners, getPlanners } = useContext(PlannerContext)
    const { workouts, getWorkoutsByUserId} = useContext(WorkoutContext)

    // current user planners state variable
    const [filteredPlanners, setFilteredPlanners] = useState([])
    
    // fetch data on page load
    useEffect(() => {
        getPlanners()
        .then(getWorkoutsByUserId(currentUserId))
        
    }, [])

    // filter planners => set state for current user
    useEffect(() => {
        const matchingPlanners = workouts.map(workout => {
            return planners.find(planner => {
                return planner.workoutId === workout.id
            })
        }) 

        setFilteredPlanners(matchingPlanners)
    }, [workouts, planners])

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