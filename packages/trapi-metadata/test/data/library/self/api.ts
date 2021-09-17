import {GET, Path, POST} from "../typescript-rest/decorators";
import {RequestConsumes, ResponseDescription, ResponseExample, ResponseProduces, SwaggerTags} from "../../../../src";
import {Person} from "../type";

@Path('mypath')
@SwaggerTags('My Services')
export class MyService {
    @ResponseDescription<string>('default', 'Error')
    @ResponseDescription<string>(400, 'The request format was incorrect.')
    @ResponseDescription<string>(500, 'There was an unexpected error.')
    @GET
    public test(): string {
        return 'OK';
    }

    /**
     * a a
     *
     * @param body
     */
    @POST
    @ResponseExample<Person[]>([{
        name: 'Joe'
    }])
    @RequestConsumes('application/json', 'text/html')
    @ResponseProduces('application/json')
    public testPostString(body: string): Person[] {
        return [];
    }
}
