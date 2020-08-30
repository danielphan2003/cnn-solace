import { toGrade } from "./grade";

export const toClassAlias = (
  className: string,
  gradeYear: number,
  sep: string,
  singletonSep: string
): string => {
  if (className.search(gradeYear.toString()) !== -1) {
    return className;
  }

  let finder = new RegExp(/^(.*)(\D+)$/);
  let isSingleton = true;

  if (!isNaN(Number(className.charAt(className.length - 1)))) {
    finder = new RegExp(/^(.*)(\D+)(\d+)$/);
    isSingleton = false;
  }

  let [_, _grade, classLetter, classIndex] = className.split(finder);

  return isSingleton
    ? `${classLetter}${singletonSep}${gradeYear}`
    : `${classLetter}${classIndex}${sep}${gradeYear}`;
};

export const toClassName = (classAlias: string): string => {
  let classInfo = parseClassAlias(classAlias);
  return `${toGrade(classInfo.gradeYear)}${classInfo.classLetter}`;
};

export const toClassNamedRange = (classAlias: string): string => {
  let classInfo = parseClassAlias(classAlias);
  return classInfo.isSingleton 
    ? `${classInfo.classLetter}_${classInfo.gradeYear}` 
    : `${classInfo.classLetter}_K${classInfo.gradeYear}`;
}

export const addNumberOfClass = (acc: number, e: any[]): number =>
  acc + Number(e[1] ?? 1);

export const parseClassAlias = (className: string): ClassInfo => {
  let finder = new RegExp(/^(\D+)(\d+)$/);
  let isSingleton = true;

  if (className.search('-K') != -1) {
    finder = new RegExp(/^(.*)-K(.*)$/);
    isSingleton = false;
  }

  let [_, classLetter, gradeYear] = className.split(finder);

  return {
    classLetter,
    gradeYear: Number(gradeYear ?? 0),
    isSingleton,
  };
};

interface ClassInfo {
  classLetter: string;
  gradeYear: number;
  isSingleton: boolean;
}