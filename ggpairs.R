
setwd("C:/Users/rcarder/Documents/dev/final-project-template-rmcarder/data")
install.packages("GGally")
library(GGally)
library(ggplot2)
library(RColorBrewer)
library(ggthemes)
dat<-read.csv("pairsdata.csv")
dat$Party<-as.factor(ifelse(dat$X2012.Dem>dat$X2012.Rep,"Dem","Rep"))
dat$Party<-factor(dat$Party, levels = c("Rep", "Dem"))
dat$Average.Voting.Wait.Time..2012.<-as.numeric(dat$Average.Voting.Wait.Time..2012.)

dat<-dat[,1:8]
dat$Party<
head(dat)

require(ggplot2)
require(reshape2)
dat$ID <- 1:nrow(dat)
dat_m <- melt(dat, id.vars=c('State'))
ggplot(iris_m) + 
  geom_line(aes(x = variable, y = value, group = ID, color = Species))



ggpairs(data=dat, # data.frame with variables
        columns=c(6,7,8,9,10,15,16,17,18,19,20,21,22),
        title="Correlations 1")+theme_hc()

ggpairs(data=dat, # data.frame with variables
        columns=c(6,7,8,9,10,25,26,27,28,29,30,31,32,33,34),
        title="Correlations 3")+theme_hc()

ggpairs(data=dat, # data.frame with variables
        columns=c(8,9,10,12,13,34,36,37,38,39,40,41,42,43),
        title="Correlations 2")+theme_hc()
          
          
          
          c(dat$State.Felon.Disenfranchisement.Rates,dat$Average.Voting.Wait.Time..2012.,dat$Gerrymandering.Index,dat$Political.Equality.Index, dat$Percentage.Unions, dat$Gini), # columns to plot, default to all.
        title="State Measures") 