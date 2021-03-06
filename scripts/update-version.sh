#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
eval JS_API=true
eval GNU=false
eval EXEC_COMPONENT=true
eval DIFFERENT_JS_API=false

eval projects=( "ng2-alfresco-core"
    "ng2-alfresco-datatable"
    "ng2-activiti-diagrams"
    "ng2-activiti-analytics"
    "ng2-activiti-form"
    "ng2-activiti-tasklist"
    "ng2-activiti-processlist"
    "ng2-alfresco-documentlist"
    "ng2-alfresco-login"
    "ng2-alfresco-search"
    "ng2-alfresco-social"
    "ng2-alfresco-tag"
    "ng2-alfresco-upload"
    "ng2-alfresco-viewer"
    "ng2-alfresco-webscript"
    "ng2-alfresco-userinfo" )

cd `dirname $0`

show_help() {
    echo "Usage: update-version.sh"
    echo ""
    echo "-sj or -sjsapi  don't update js-api version"
    echo "-vj or -versionjsapi  to use a different version of js-api"
    echo "-demoshell execute the change version only in the demo shell "
    echo "-v or -version  version to update"
    echo "-gnu for gnu"
}

skip_js() {
    echo "====== Skip JS-API change version $1 ====="
    JS_API=false
}

gnu_mode() {
    echo "====== GNU MODE ====="
    GNU=true
}

version_change() {
    echo "====== New version $1 ====="
    VERSION=$1
}

version_js_change() {
    echo "====== Alfresco JS-API version $1 ====="
    VERSION_JS_API=$1
    DIFFERENT_JS_API=true
}

only_demoshell() {
    echo "====== UPDATE Only the demo shell versions ====="
    EXEC_COMPONENT=false
}


update_component_version() {
   echo "====== UPDATE PACKAGE VERSION of ${PACKAGE} to ${VERSION} version in all the package.json ======"
   DESTDIR="$DIR/../ng2-components/${1}"
   sed "${sedi[@]}" "s/\"version\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"version\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
}

clean_lock() {
   echo "====== clean lock file ${1} ======"
   DESTDIR="$DIR/../ng2-components/${1}"
   rm ${DESTDIR}/package-lock.json
}

update_component_dependency_version(){
   DESTDIR="$DIR/../ng2-components/${1}"

   for (( j=0; j<${projectslength}; j++ ));
    do
       echo "====== UPDATE DEPENDENCY VERSION of ${projects[$j]} to ~${VERSION} in ${1}======"

       sed "${sedi[@]}" "s/\"${projects[$j]}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${projects[$j]}\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
       sed "${sedi[@]}" "s/\"${projects[$j]}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${projects[$j]}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json

    done
}

update_total_build_dependency_version(){
   DESTDIR="$DIR/../ng2-components/"

   for (( j=0; j<${projectslength}; j++ ));
    do
       echo "====== UPDATE TOTAL BUILD DEPENDENCY VERSION of ${projects[$j]} to ~${VERSION} in ${1}======"
       sed "${sedi[@]}" "s/\"${projects[$j]}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${projects[$j]}\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
       sed "${sedi[@]}" "s/\"${projects[$j]}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${projects[$j]}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json
     done
}

update_total_build_dependency_js_version(){
    echo "====== UPDATE DEPENDENCY VERSION of total build to ~${1} in ${DESTDIR}======"
    DESTDIR="$DIR/../ng2-components/"
    PACKAGETOCHANGE="alfresco-js-api"

    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json
    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json
}

update_component_js_version(){
   echo "====== UPDATE DEPENDENCY VERSION of alfresco-js-api in ${1} to ${2} ======"
   DESTDIR="$DIR/../ng2-components/${1}"

   PACKAGETOCHANGE="alfresco-js-api"

   sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"${2}\"/g"  ${DESTDIR}/package.json
   sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"${2}\"/g"  ${DESTDIR}/package.json

}

update_demo_shell_dependency_version(){

   for (( k=0; k<${projectslength}; k++ ));
   do
    echo "====== UPDATE VERSION OF DEMO-SHELL to ${projects[$k]} version ${VERSION} ======"
    DESTDIR="$DIR/../demo-shell-ng2/"

    sed "${sedi[@]}" "s/\"${projects[$k]}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${projects[$k]}\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
    sed "${sedi[@]}" "s/\"${projects[$k]}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${projects[$k]}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json
   done
}

update_demo_shell_js_version(){
    echo "====== UPDATE VERSION OF DEMO-SHELL to  alfresco-js-api version ${1} ======"
    DESTDIR="$DIR/../demo-shell-ng2/"
    PACKAGETOCHANGE="alfresco-js-api"

    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json
    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json
}

clean_lock_demo_shell(){
   echo "====== clean lock file demo-shell ======"
    DESTDIR="$DIR/../demo-shell-ng2/"
    rm ${DESTDIR}/package-lock.json
}

while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -v|version) version_change $2; shift 2;;
      -sj|sjsapi) skip_js; shift;;
      -vj|versionjsapi)  version_js_change $2; shift 2;;
      -gnu) gnu_mode; shift;;
      -demoshell) only_demoshell; shift;;
      -*) shift;;
    esac
done

if $GNU; then
 sedi='-i'
else
 sedi=('-i' '')
fi

if [[ "${VERSION}" == "" ]]
then
  echo "Version number required"
  exit 1
fi

cd "$DIR/../"

projectslength=${#projects[@]}

if $EXEC_COMPONENT == true; then
    echo "====== UPDATE COMPONENTS ======"

    # use for loop to read all values and indexes
    for (( i=0; i<${projectslength}; i++ ));
    do
       clean_lock ${projects[$i]}
       echo "====== UPDATE COMPONENT ${projects[$i]} ======"
       update_component_version ${projects[$i]}
       update_component_dependency_version ${projects[$i]}

       if $JS_API == true; then

        if $DIFFERENT_JS_API == true; then
            update_component_js_version ${projects[$i]} ${VERSION_JS_API}
        else
            update_component_js_version ${projects[$i]} ${VERSION}
        fi

       fi
    done

    echo "====== UPDATE TOTAL BUILD======"

    update_total_build_dependency_version

    if $JS_API == true; then
        if $DIFFERENT_JS_API == true; then
            update_total_build_dependency_js_version ${VERSION_JS_API}
        else
            update_total_build_dependency_js_version ${VERSION}
        fi
    fi
fi

echo "====== UPDATE DEMO SHELL ======"

clean_lock_demo_shell

update_demo_shell_dependency_version

if $JS_API == true; then
    if $DIFFERENT_JS_API == true; then
        update_demo_shell_js_version ${VERSION_JS_API}
    else
        update_demo_shell_js_version ${VERSION}
    fi
fi

DESTDIR="$DIR/../demo-shell-ng2/"
sed "${sedi[@]}" "s/\"version\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"version\": \"${VERSION}\"/g"  ${DIR}/../demo-shell-ng2/package.json

if $EXEC_COMPONENT == true; then
    rm ${DIR}/../ng2-components/package-lock.json
    sed "${sedi[@]}" "s/\"version\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"version\": \"${VERSION}\"/g"  ${DIR}/../ng2-components/package.json
    sed "${sedi[@]}" "s/\"version\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"version\": \"${VERSION}\"/g"  ${DIR}/../ng2-components/package-base.json
fi
