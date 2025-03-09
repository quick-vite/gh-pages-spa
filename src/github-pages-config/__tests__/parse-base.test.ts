import { describe, expect } from "vitest";
import { GitHubPackageJson } from "../../shared/package-json.mts";
import { parseBase } from "../parse-base.mts";

describe('parseBase', () => {

    describe('gh-page', test => {

        test('single-segment returnsResult', () => {
            // Arrange
            const packageJson: GitHubPackageJson = {
                name: 'project',
                version: '0.0.0',
                homepage: 'https://quick-vite.github.io/gh-pages-spa/'
            }

            // Act
            const [routeBase, routePath, skipSegments] = parseBase(packageJson)

            // Assert
            expect(routeBase).toBe('/gh-pages-spa/')
            expect(routePath).toBe('gh-pages-spa')
            expect(skipSegments).toBe(1)
        })

        test('no-segment throws', () => {
            // Arrange
            const packageJson: GitHubPackageJson = {
                name: 'project',
                version: '0.0.0',
                homepage: 'https://quick-vite.github.io/'
            }

            // Act
            const result = () => parseBase(packageJson)

            // Assert
            expect(result).toThrowError()
        })

        test('multi-segment throws', () => {
            // Arrange
            const packageJson: GitHubPackageJson = {
                name: 'project',
                version: '0.0.0',
                homepage: 'https://quick-vite.github.io/one/two/'
            }

            // Act
            const result = () => parseBase(packageJson)

            // Assert
            expect(result).toThrowError()
        })
    })

    describe('custom domain', test => {

        test('no-segment returnsResult', () => {
            // Arrange
            const packageJson: GitHubPackageJson = {
                name: 'project',
                version: '0.0.0',
                homepage: 'https://acme.io/'
            }

            // Act
            const [routeBase, routePath, skipSegments] = parseBase(packageJson)

            // Assert
            expect(routeBase).toBe('/')
            expect(routePath).toBe(undefined)
            expect(skipSegments).toBe(0)
        })

        test('single-segment returnsResult', () => {
            // Arrange
            const packageJson: GitHubPackageJson = {
                name: 'project',
                version: '0.0.0',
                homepage: 'https://acme.io/one/'
            }

            // Act
            const [routeBase, routePath, skipSegments] = parseBase(packageJson)

            // Assert
            expect(routeBase).toBe('/one/')
            expect(routePath).toBe('one')
            expect(skipSegments).toBe(1)
        })

        test('multi-segment returnsResult', () => {
            // Arrange
            const packageJson: GitHubPackageJson = {
                name: 'project',
                version: '0.0.0',
                homepage: 'https://acme.io/one/two/'
            }

            // Act
            const [routeBase, routePath, skipSegments] = parseBase(packageJson)

            // Assert
            expect(routeBase).toBe('/one/two/')
            expect(routePath).toBe('one/two')
            expect(skipSegments).toBe(2)
        })
    })
})