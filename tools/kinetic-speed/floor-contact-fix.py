"""Earliest support points, not vertex storage order, form the swept floor manifold."""
from pathlib import Path
import sys
p=Path(sys.argv[1])/'src/own-engine/constraints.hpp';s=p.read_text()
old='''    int emitted=0;
    for(int k=0;k<count;k++){
     V p=points[k];float sep=p.y-top;V velocity=pointV(A,p-A.p);
     if(sep<=.012f||sep+velocity.y*dt>.002f)continue;
     V at=p+velocity*(sep/maxf(.001f,-velocity.y));
     if(at.x<floor.lo.x+.01f||at.x>floor.hi.x-.01f||at.z<floor.lo.z+.01f||at.z>floor.hi.z-.01f)continue;
     contact(a,b,i,0,p,V(0,-1,0),-sep);if(++emitted>=4)break;
    }'''
new='''    // Use the earliest support points, not the first four vertices in storage
    // order (which may all lie on one side and introduce an artificial torque).
    V candidate[40];float when[40];int found=0;
    for(int k=0;k<count;k++){
     V p=points[k];float sep=p.y-top;V velocity=pointV(A,p-A.p);
     if(sep<=.012f||sep+velocity.y*dt>.002f)continue;
     float t=sep/maxf(.001f,-velocity.y);V at=p+velocity*t;
     if(at.x<floor.lo.x+.01f||at.x>floor.hi.x-.01f||at.z<floor.lo.z+.01f||at.z>floor.hi.z-.01f)continue;
     int insert=found++;while(insert>0&&when[insert-1]>t){when[insert]=when[insert-1];candidate[insert]=candidate[insert-1];insert--;}
     when[insert]=t;candidate[insert]=p;
    }
    for(int k=0;k<found&&k<4;k++){V p=candidate[k];contact(a,b,i,0,p,V(0,-1,0),top-p.y);}'''
assert s.count(old)==1;p.write_text(s.replace(old,new))
print('Corrected support-point order in fast thin-debris floor contact.')
