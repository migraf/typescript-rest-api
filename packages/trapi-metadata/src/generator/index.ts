/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {sync} from 'glob';
import {
    ClassDeclaration,
    CompilerOptions,
    createProgram,
    forEachChild,
    InterfaceDeclaration,
    isModuleBlock,
    isModuleDeclaration,
    Node,
    NodeFlags,
    Program,
    SourceFile,
    SyntaxKind,
    TypeChecker
} from 'typescript';
import {Config, Controller, GeneratorOutput} from "../type";
import {DecoratorMapper} from "../decorator/mapper";
import {ControllerGenerator} from './controller';
import {TypeNodeResolver} from "../resolver";
import {Resolver} from "../resolver";
import {CacheDriver} from "../cache/driver";

const minimatch = require("minimatch");

export class MetadataGenerator {
    public readonly nodes = new Array<Node>();
    public readonly typeChecker: TypeChecker;

    public readonly decoratorMapper: DecoratorMapper;

    public readonly config: Config;

    private readonly program: Program;

    private cache : CacheDriver;
    private controllers: Controller[];
    private referenceTypes: Resolver.ReferenceTypes = {};

    private circularDependencyResolvers = new Array<Resolver.DependencyResolver>();

    // -------------------------------------------------------------------------

    constructor(
        config: Config,
        compilerOptions: CompilerOptions
    ) {
        this.config = config;

        this.cache = new CacheDriver(config.cache);
        this.decoratorMapper = new DecoratorMapper(config.decorator);

        TypeNodeResolver.clearCache();

        const sourceFiles = this.scanSourceFiles(config.entryFile);
        this.program = createProgram(sourceFiles, compilerOptions);
        this.typeChecker = this.program.getTypeChecker();
    }

    // -------------------------------------------------------------------------

    public generate(): GeneratorOutput {
        const sourceFileSize : number = this.buildNodesFromSourceFiles();

        let cache = this.cache.get(sourceFileSize);

        if(!cache) {
            this.buildControllers();

            this.circularDependencyResolvers.forEach(resolve => resolve(this.referenceTypes));

            cache = {
                controllers: this.controllers,
                referenceTypes: this.referenceTypes,
                sourceFilesSize: sourceFileSize
            };

            this.cache.save(cache);
        }

        return {
            controllers: cache.controllers,
            referenceTypes: cache.referenceTypes
        };
    }

    protected buildNodesFromSourceFiles() : number {
        let endSize : number = 0;

        this.program.getSourceFiles().forEach((sf: SourceFile) => {
            const isIgnored : boolean = this.isIgnoredPath(sf.fileName);
            if(isIgnored) {
                return;
            }

            endSize += sf.end;

            forEachChild(sf, (node: any) => {
                if (isModuleDeclaration(node)) {
                    /**
                     * For some reason unknown to me, TS resolves both `declare module` and `namespace` to
                     * the same kind (`ModuleDeclaration`). In order to figure out whether it's one or the other,
                     * we check the node flags. They tell us whether it is a namespace or not.
                     */

                    // tslint:disable-next-line:no-bitwise
                    if ((node.flags & NodeFlags.Namespace) === 0 && node.body && isModuleBlock(node.body)) {
                        node.body.statements.forEach(statement => {
                            this.nodes.push(statement);
                        });
                        return;
                    }
                }


                this.nodes.push(node);
            });
        });

        return endSize;
    }

    // -------------------------------------------------------------------------

    /**
     * Check if the source file path is in the ignored path list.
     *
     * @param filePath
     * @protected
     */
    protected isIgnoredPath(filePath: string) : boolean {
        if(typeof this.config.ignore === 'undefined') {
            return false;
        }

        return this.config.ignore.some(item => minimatch(filePath, item));
    }

    // -------------------------------------------------------------------------

    public isExportedNode(node: Node) {
        return true;
    }

    // -------------------------------------------------------------------------

    public addReferenceType(referenceType: Resolver.ReferenceType) {
        if (!referenceType.refName) {
            return;
        }

        this.referenceTypes[referenceType.refName] = referenceType;
    }

    public getReferenceType(refName: string) {
        return this.referenceTypes[refName];
    }

    public registerDependencyResolver(callback: Resolver.DependencyResolver) {
        this.circularDependencyResolvers.push(callback);
    }

    public getClassDeclaration(className: string) {
        const found = this.nodes
            .filter(node => {
                const classDeclaration = (node as ClassDeclaration);
                return (node.kind === SyntaxKind.ClassDeclaration && classDeclaration.name && classDeclaration.name.text === className);
            });
        if (found && found.length) {
            return found[0];
        }
        return undefined;
    }

    public getInterfaceDeclaration(className: string) {
        const found = this.nodes
            .filter(node => {
                const interfaceDeclaration = (node as InterfaceDeclaration);
                return (node.kind === SyntaxKind.InterfaceDeclaration && interfaceDeclaration.name && interfaceDeclaration.name.text === className);
            });
        if (found && found.length) {
            return found[0];
        }
        return undefined;
    }

    private scanSourceFiles(sourceFiles: string | string[]) {
        const sourceFilesExpressions = Array.isArray(sourceFiles) ? sourceFiles : [sourceFiles];
        const result: Set<string> = new Set<string>();
        const options = { cwd: process.cwd() };
        sourceFilesExpressions.forEach(pattern => {
            const matches = sync(pattern, options);
            matches.forEach(file => {result.add(file); });
        });

        return Array.from(result);
    }

    private buildControllers() : void {
        this.controllers = this.nodes
            .filter(node => node.kind === SyntaxKind.ClassDeclaration)
            .filter(node => {
                const isHidden = this.decoratorMapper.match('HIDDEN', node);

                return typeof isHidden === 'undefined';
            })
            .filter(node => typeof this.decoratorMapper.match('CLASS_PATH', node) !== 'undefined')
            .map((classDeclaration: ClassDeclaration) => new ControllerGenerator(classDeclaration, this))
            .filter(generator => generator.isValid())
            .map(generator => generator.generate());
    }
}
