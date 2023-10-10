export type Todo = {
	id: string;
    title: string;
    description: string;
    dateCreated: Date;
	isDone: boolean;
	dateDeleted?: Date;
	dateMarkedAsToBeDoneToday?: Date;
	numberOfTimesMarkedAsToBeDoneToday: number;
};
