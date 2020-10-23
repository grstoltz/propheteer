import { AxiosResponse } from "axios";

export interface FlaskResponse extends AxiosResponse {
	data: any;
	code: string;
}

export interface ParsedData {
	y: string;
	ds: string;
}

export interface GAResponse {
	name: string;
	id: string;
}
