import path from "path";
const jsonata = require('jsonata');
import {Config, Generator, Property, Resolver} from "../../../src";

const entryFile : string = './test/data/library/typescript-rest/api.ts';
const config : Config = {
    entryFile: [entryFile],
    cache: false,
    decorator: {
        internal: true,
        library: 'typescript-rest'
    }
};

const generator = new Generator(config, {});

const metadata = generator.generate();

describe('library/typescript-rest', () => {
    it('should be generated and have top level properties', () => {
        expect(metadata).toBeDefined();
        expect(metadata).toHaveProperty('controllers');
        expect(metadata).toHaveProperty('referenceTypes');
    });

    describe('check controllers', () => {
        it('should have elements', () => {
            expect(metadata.controllers.length).toBeGreaterThan(0);
        });

        it('should have abstract structure', () => {
            expect(metadata.controllers[0]).toHaveProperty('consumes');
            expect(metadata.controllers[0].consumes.length).toEqual(0);

            expect(metadata.controllers[0]).toHaveProperty('location');
            expect(metadata.controllers[0].location).toEqual("test/data/library/typescript-rest/api.ts");

            expect(metadata.controllers[0]).toHaveProperty('methods');
            expect(metadata.controllers[0].methods.length).toBeGreaterThan(0);

            expect(metadata.controllers[0]).toHaveProperty('name');
            expect(metadata.controllers[0].name).toEqual('TestUnionType');

            expect(metadata.controllers[0]).toHaveProperty('path');
            expect(metadata.controllers[0].path).toEqual('unionTypes');

            expect(metadata.controllers[0]).toHaveProperty('produces');
            expect(metadata.controllers[0].produces.length).toEqual(0);

            expect(metadata.controllers[0]).toHaveProperty('responses');
            expect(metadata.controllers[0].responses.length).toEqual(0);

            expect(metadata.controllers[0]).toHaveProperty('tags');
            expect(metadata.controllers[0].tags.length).toEqual(0);
        });

        it('should have methods', () => {
            const method = metadata.controllers[0].methods[0];

            expect(method).toHaveProperty('consumes');
            expect(method.consumes.length).toEqual(0);

            expect(method).toHaveProperty('deprecated');
            expect(method.deprecated).toBeFalsy();

            expect(method).toHaveProperty('extensions');
            expect(method.extensions.length).toEqual(0);

            expect(method).toHaveProperty('hidden');
            expect(method.hidden).toBeFalsy();

            expect(method).toHaveProperty('method');
            expect(method.method).toEqual("post");

            expect(method).toHaveProperty('name');
            expect(method.name).toEqual("post");

            expect(method).toHaveProperty('parameters');
            expect(method.parameters.length).toBeGreaterThan(0);

            expect(method).toHaveProperty('path');
            expect(method.path).toEqual("");

            expect(method).toHaveProperty('produces');
            expect(method.produces.length).toEqual(0);

            expect(method).toHaveProperty('responses');
            expect(method.responses.length).toEqual(1);

            expect(method).toHaveProperty('tags');
            expect(method.tags.length).toEqual(0);

            expect(method).toHaveProperty('type');
            expect(method.type).toHaveProperty('typeName');
            expect(method.type.typeName).toEqual('string');
        });
    })

    describe('check referenceTypes', () => {
        it('referenceTypes should be defined', () => {
            expect(metadata.referenceTypes).toHaveProperty('MyTypeWithUnion');
            expect(metadata.referenceTypes).toHaveProperty('Address');
            expect(metadata.referenceTypes).toHaveProperty('Person');
            expect(metadata.referenceTypes).toHaveProperty('TestEnum');
            expect(metadata.referenceTypes).toHaveProperty('TestNumericEnum');
            expect(metadata.referenceTypes).toHaveProperty('TestMixedEnum');
            expect(metadata.referenceTypes).toHaveProperty('TestInterface');
            // todo: tod object keys seem not to work :(
            // expect(metadata.referenceTypes).toHaveProperty('Return\.NewResourcePerson');
            // expect(metadata.referenceTypes).toHaveProperty('Return\.DownloadBinaryData');
            expect(metadata.referenceTypes).toHaveProperty('MyDataType2');
            expect(metadata.referenceTypes).toHaveProperty('UUID');
            expect(metadata.referenceTypes).toHaveProperty('Something');
            expect(metadata.referenceTypes).toHaveProperty('SimpleHelloType');
            expect(metadata.referenceTypes).toHaveProperty('PrimitiveClassModel');
            expect(metadata.referenceTypes).toHaveProperty('PrimitiveInterfaceModel');
            expect(metadata.referenceTypes).toHaveProperty('ResponseBodystringarray');
            expect(metadata.referenceTypes).toHaveProperty('NamedEntity');
        });

        it('referenceType MyTypeWithUnion', () => {
            let expression = jsonata("MyTypeWithUnion.properties[0]");
            let value : Property = expression.evaluate(metadata.referenceTypes);

            expect(value.name).toEqual('property');
            expect(value.required).toBeTruthy();
            expect(value.type).toBeDefined();
            expect(value.type.typeName).toEqual('union');
            expect((value.type as Resolver.UnionType).members).toBeDefined();
            expect((value.type as Resolver.UnionType).members.length).toEqual(2);
            expect((value.type as Resolver.UnionType).members[0].typeName).toEqual('enum');
            expect((value.type as Resolver.UnionType).members[1].typeName).toEqual('enum');
        })

        it('referenceType Address', () => {
            let expression = jsonata("Address.properties[0]");
            let value : Property = expression.evaluate(metadata.referenceTypes);

            expect(value.name).toEqual('street');
            expect(value.required).toBeTruthy();
            expect(value.type).toBeDefined();
            expect(value.type.typeName).toEqual('string');
        })

        it('referenceType Person', () => {
            let expression = jsonata("Person.properties[0]");
            let value : Property = expression.evaluate(metadata.referenceTypes);

            expect(value.name).toEqual('name');
            expect(value.required).toBeTruthy();
            expect(value.type).toBeDefined();
            expect(value.type.typeName).toEqual('string');

            expression = jsonata("Person.properties[1]");
            value = expression.evaluate(metadata.referenceTypes);

            expect(value.name).toEqual('address');
            expect(value.required).toBeFalsy();
            expect(value.type).toBeDefined();
            expect(value.type.typeName).toEqual('refObject');
        })

        it('referenceType TestEnum', () => {
            let expression = jsonata("TestEnum");
            let value : Resolver.RefEnumType = expression.evaluate(metadata.referenceTypes);

            expect(value.typeName).toEqual('refEnum');
            expect(value.members).toEqual(["option1", "option2"]);
            expect(value.memberNames).toEqual(["Option1", "Option2"]);
            expect(value.deprecated).toBeFalsy();
        })

        it('referenceType TestNumericEnum', () => {
            let expression = jsonata("TestNumericEnum");
            let value : Resolver.RefEnumType = expression.evaluate(metadata.referenceTypes);

            expect(value.typeName).toEqual('refEnum');
            expect(value.members).toEqual([0, 1]);
            expect(value.memberNames).toEqual(["Option1", "Option2"]);
            expect(value.deprecated).toBeFalsy();
        })

        it('referenceType TestMixedEnum', () => {
            let expression = jsonata("TestMixedEnum");
            let value : Resolver.RefEnumType = expression.evaluate(metadata.referenceTypes);

            expect(value.typeName).toEqual('refEnum');
            expect(value.members).toEqual([0, "option2"]);
            expect(value.memberNames).toEqual(["Option1", "Option2"]);
            expect(value.deprecated).toBeFalsy();
        })

        it('referenceType TestInterface', () => {
            let expression = jsonata("TestInterface");
            let value : Resolver.RefObjectType = expression.evaluate(metadata.referenceTypes);

            expect(value.typeName).toEqual('refObject');

            expect(value.properties).toBeDefined();
            expect(value.properties.length).toEqual(2);

            expect(value.properties[0].name).toEqual("a");
            expect(value.properties[0].type.typeName).toEqual("string");

            expect(value.properties[1].name).toEqual("b");
            expect(value.properties[1].type.typeName).toEqual("double");
        })

        it('referenceType MyDataType2', () => {
            let expression = jsonata("MyDataType2");
            let value : Resolver.RefObjectType = expression.evaluate(metadata.referenceTypes);

            expect(value.typeName).toEqual('refObject');

            expect(value.properties).toBeDefined();
            expect(value.properties.length).toEqual(2);

            expect(value.properties[0].name).toEqual("prop");
            expect(value.properties[0].type.typeName).toEqual("string");

            expect(value.properties[1].name).toEqual("property1");
            expect(value.properties[1].type.typeName).toEqual("string");
        })

        it('referenceType UUID', () => {
            let expression = jsonata("UUID");
            let value : Resolver.RefAliasType = expression.evaluate(metadata.referenceTypes);

            expect(value.typeName).toEqual('refAlias');
            expect(value.refName).toEqual('UUID');
            expect(value.type.typeName).toEqual('string');
        })

        it('referenceType Something', () => {
            let expression = jsonata("Something");
            let value : Resolver.RefObjectType = expression.evaluate(metadata.referenceTypes);

            expect(value.typeName).toEqual('refObject');

            expect(value.properties).toBeDefined();
            expect(value.properties.length).toEqual(3);

            expect(value.properties[0].name).toEqual("id");
            expect(value.properties[0].type.typeName).toEqual("refAlias");
            expect((value.properties[0].type as Resolver.RefAliasType).refName).toEqual("UUID");

            expect(value.properties[1].name).toEqual("someone");
            expect(value.properties[1].type.typeName).toEqual("string");

            expect(value.properties[2].name).toEqual("kind");
            expect(value.properties[2].type.typeName).toEqual("string");
        })

        it('referenceType SimpleHelloType', () => {
            let expression = jsonata("SimpleHelloType");
            let value : Resolver.RefAliasType = expression.evaluate(metadata.referenceTypes);

            expect(value.typeName).toEqual('refAlias');

            expect(value.type.typeName).toEqual('nestedObjectLiteral');

            const typeValue = value.type as Resolver.NestedObjectLiteralType;

            expect(typeValue.properties).toBeDefined();
            expect(typeValue.properties.length).toEqual(4);

            expect(typeValue.properties[0].name).toEqual("comparePassword");
            expect(typeValue.properties[0].type.typeName).toEqual("object");

            expect(typeValue.properties[1].name).toEqual("profile");
            expect(typeValue.properties[1].description).toEqual("Description for profile");
            expect(typeValue.properties[1].type.typeName).toEqual("nestedObjectLiteral");

            expect(typeValue.properties[2].name).toEqual("arrayOfSomething");
            expect(typeValue.properties[2].type.typeName).toEqual("array");

            const arrayElementTypeValue = (typeValue.properties[2].type as Resolver.ArrayType).elementType;

            expect(arrayElementTypeValue.typeName).toEqual('refObject');
            expect((arrayElementTypeValue as Resolver.RefObjectType).refName).toEqual('Something');

            expect(typeValue.properties[3].name).toEqual("greeting");
            expect(typeValue.properties[3].type.typeName).toEqual("string");
        })

        it('referenceType PrimitiveClassModel & PrimitiveInterfaceModel', () => {
            const values : Resolver.RefObjectType[] = [
                jsonata("PrimitiveClassModel").evaluate(metadata.referenceTypes),
                jsonata("PrimitiveInterfaceModel").evaluate(metadata.referenceTypes)
            ];

            values.map(value => {
                expect(value.typeName).toEqual('refObject');
                expect(value.properties).toBeDefined();
                expect(value.properties.length).toEqual(4);

                expect(value.properties[0].name).toEqual("int");
                expect(value.properties[0].description).toEqual("An integer");
                expect(value.properties[0].type.typeName).toEqual("integer");

                expect(value.properties[1].name).toEqual("long");
                expect(value.properties[1].type.typeName).toEqual("long");

                expect(value.properties[2].name).toEqual("float");
                expect(value.properties[2].type.typeName).toEqual("float");

                expect(value.properties[3].name).toEqual("double");
                expect(value.properties[3].type.typeName).toEqual("double");
            });
        });

        it('referenceType ResponseBodystringarray', () => {
            let expression = jsonata("ResponseBodystringarray");
            let value: Resolver.RefObjectType = expression.evaluate(metadata.referenceTypes);

            expect(value.properties).toBeDefined();
            expect(value.properties[0].name).toEqual('data');
            expect(value.properties[0].required).toBeTruthy();
            expect(value.properties[0].type.typeName).toEqual('array');
            expect((value.properties[0].type as Resolver.ArrayType).elementType.typeName).toEqual('string');
        });

        it('referenceType NamedEntity', () => {
            let expression = jsonata("NamedEntity");
            let value: Resolver.RefObjectType = expression.evaluate(metadata.referenceTypes);

            expect(value).toBeDefined();
            // todo: better testing.
        });
    })
})
